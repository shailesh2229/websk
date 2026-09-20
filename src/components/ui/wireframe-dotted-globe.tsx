"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  className?: string
  paused?: boolean
  dimmed?: boolean
  interactive?: boolean
  zoomLevel?: number // 1.0 = default, clamped [0.85, 1.5]
}

export default function RotatingEarth({ 
  className = "",
  paused = false,
  dimmed = false,
  interactive = true,
  zoomLevel = 1.0,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // We keep these in refs so the D3 render loop always sees the latest props without rebinding
  const stateRef = useRef({ paused, dimmed, interactive, zoomLevel })
  useEffect(() => {
    stateRef.current = { paused, dimmed, interactive, zoomLevel }
  }, [paused, dimmed, interactive, zoomLevel])

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

    const allDots: [number, number, number][] = [] // 3D coordinates [x,y,z] before projection
    let landFeatures: any
    let graticulePath: any = null
    let landPath: any = null

    // Create a path generator that doesn't clear the context per feature
    const renderPath = d3.geoPath().projection(projection).context(context)

    const render = (time: number) => {
      // Time-based rotation (approx 0.5 degrees per 16ms = 30 deg/sec)
      // 10 degrees per second:
      if (!isDragging) {
        rotation[0] = (time * 0.01) % 360
      }
      // Apply zoom level from prop
      projection.scale(radius * stateRef.current.zoomLevel)
      projection.rotate(rotation as [number, number, number])
      
      context.clearRect(0, 0, size, size)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius
      const isDimmed = stateRef.current.dimmed

      // Ocean
      context.beginPath()
      context.arc(size / 2, size / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "transparent"
      context.fill()
      context.strokeStyle = isDimmed ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)"
      context.lineWidth = 1.5 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Graticule (batched)
        if (!graticulePath) graticulePath = d3.geoGraticule()()
        context.beginPath()
        renderPath(graticulePath)
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = isDimmed ? 0.05 : 0.15
        context.stroke()

        // Land (batched)
        if (!landPath) {
          landPath = { type: "FeatureCollection", features: landFeatures.features }
        }
        context.beginPath()
        renderPath(landPath)
        context.strokeStyle = "#ffffff"
        context.lineWidth = 0.5 * scaleFactor
        context.globalAlpha = isDimmed ? 0.1 : 0.3
        context.stroke()
        context.globalAlpha = 1

        // Dots (batched)
        context.fillStyle = isDimmed ? "rgba(153, 153, 153, 0.2)" : "rgba(153, 153, 153, 0.8)"
        
        // When dimmed, skip every second dot to lower density
        const dotStep = isDimmed ? 2 : 1
        const dotSize = 1.5 * scaleFactor
        
        context.beginPath()
        for (let i = 0; i < allDots.length; i += dotStep) {
          const projected = projection([allDots[i][0], allDots[i][1]])
          if (projected) {
            // Check visibility using 3D spherical math (if the dot is on the back, the projection might still return something or we can check distance from center, but d3 geoOrthographic handles clipping if we clipAngle(90))
            // Actually, geoOrthographic with clipAngle(90) returns null for hidden points if we project them individually, but we know it's hidden if projected is null.
            context.rect(projected[0] - dotSize/2, projected[1] - dotSize/2, dotSize, dotSize)
          }
        }
        context.fill()
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/data/ne_110m_land.json")
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()
        
        // Generate dots
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push([lng, lat, 0])
          })
        })

        setIsLoading(false)
      } catch {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    const rotation = [0, 0]
    let isDragging = false
    let animationFrameId: number

    const tick = (time: DOMHighResTimeStamp) => {
      render(time)
      animationFrameId = requestAnimationFrame(tick)
    }
    
    // Start loop immediately
    animationFrameId = requestAnimationFrame(tick)

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
      cancelAnimationFrame(animationFrameId)
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
