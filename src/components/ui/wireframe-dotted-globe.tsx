"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  className?: string
  paused?: boolean
  dimmed?: boolean
  interactive?: boolean
}

export default function RotatingEarth({ 
  className = "",
  paused = false,
  dimmed = false,
  interactive = true
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // We keep these in refs so the D3 render loop always sees the latest props without rebinding
  const stateRef = useRef({ paused, dimmed, interactive })
  useEffect(() => {
    stateRef.current = { paused, dimmed, interactive }
  }, [paused, dimmed, interactive])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Fixed internal resolution
    const size = 1000
    const radius = size / 2.2
    
    // Cap DPR at 2 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      
      // Lower density on mobile by scaling stepSize based on window width
      const isMobile = window.innerWidth < 768
      const actualSpacing = isMobile ? dotSpacing * 1.5 : dotSpacing
      const stepSize = actualSpacing * 0.08

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }
      return dots
    }

    interface DotData {
      lng: number
      lat: number
    }

    const allDots: DotData[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any

    const render = () => {
      context.clearRect(0, 0, size, size)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius
      const isDimmed = stateRef.current.dimmed

      // Draw ocean (transparent)
      context.beginPath()
      context.arc(size / 2, size / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "transparent"
      context.fill()
      context.strokeStyle = isDimmed ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)"
      context.lineWidth = 1.5 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = isDimmed ? 0.05 : 0.15
        context.stroke()
        context.globalAlpha = 1

        // Land outlines (faint)
        context.beginPath()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          path(feature)
        })
        context.strokeStyle = "#ffffff"
        context.lineWidth = 0.5 * scaleFactor
        context.globalAlpha = isDimmed ? 0.1 : 0.3
        context.stroke()
        context.globalAlpha = 1

        // Dots
        context.fillStyle = isDimmed ? "rgba(153, 153, 153, 0.2)" : "rgba(153, 153, 153, 0.8)"
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= size &&
            projected[1] >= 0 &&
            projected[1] <= size
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.5 * scaleFactor, 0, 2 * Math.PI)
            context.fill()
          }
        })
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/data/ne_110m_land.json")
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat })
          })
        })

        render()
        setIsLoading(false)
      } catch {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    const rotation = [0, 0]
    let isDragging = false
    const rotationSpeed = 0.5

    const rotate = () => {
      if (!stateRef.current.paused && !isDragging) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation as [number, number, number])
        render()
      } else if (isDragging) {
        // If dragging, we still want to render, but rotation is updated by mousemove
        render()
      }
    }

    const rotationTimer = d3.timer(rotate)

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      if (!stateRef.current.interactive) return
      isDragging = true
      
      let startX = 0
      let startY = 0
      if (window.TouchEvent && event instanceof TouchEvent) {
        startX = event.touches[0].clientX
        startY = event.touches[0].clientY
      } else {
        startX = (event as MouseEvent).clientX
        startY = (event as MouseEvent).clientY
      }
      
      const startRotation = [...rotation]

      const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        const sensitivity = 0.5
        let cx = 0
        let cy = 0
        if (window.TouchEvent && moveEvent instanceof TouchEvent) {
          cx = moveEvent.touches[0].clientX
          cy = moveEvent.touches[0].clientY
        } else {
          cx = (moveEvent as MouseEvent).clientX
          cy = (moveEvent as MouseEvent).clientY
        }
        
        const dx = cx - startX
        const dy = cy - startY

        rotation[0] = startRotation[0] + dx * sensitivity
        rotation[1] = startRotation[1] - dy * sensitivity
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]))

        projection.rotate(rotation as [number, number, number])
        render()
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleMouseMove)
        document.removeEventListener("touchend", handleMouseUp)

        setTimeout(() => {
          isDragging = false
        }, 10)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleMouseMove, { passive: false })
      document.addEventListener("touchend", handleMouseUp)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("touchstart", handleMouseDown, { passive: true })

    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("touchstart", handleMouseDown)
    }
  }, []) // Empty dependency array as we use stateRef for mutable props

  if (error) {
    return null
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  )
}
