"use client";

import { useEffect, useRef } from "react";
import { useZoom } from "../layout/ZoomContext";
import { useTransform, motion } from "framer-motion";

export function SpaceBackground() {
  const { progress } = useZoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parallax scaling for the 3 star layers based on zoom progress
  const baseScale = useTransform(progress, [0, 3], [1, 1.28]);
  const rotation = useTransform(progress, (p) => p * 2); // subtle rotation

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // optimization
    if (!ctx) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // Add extra padding to canvas so scaling/rotating doesn't reveal edges
    const width = window.innerWidth * 1.5;
    const height = window.innerHeight * 1.5;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Center the rendering origin for rotation
    const cx = width / 2;
    const cy = height / 2;

    const createStars = (starCount: number, sizeRange: [number, number], glow: boolean) => {
      const actualCount = isMobile ? Math.floor(starCount / 2) : starCount;
      const stars: any[] = [];
      
      for (let i = 0; i < actualCount; i++) {
        const x = (Math.random() - 0.5) * width;
        const y = (Math.random() - 0.5) * height;
        const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        const alpha = 0.3 + Math.random() * 0.7;
        
        stars.push({ x, y, size, alpha, origAlpha: alpha, timeOffset: Math.random() * 10000, glow });
      }
      return stars;
    };

    const farLayer = createStars(250, [0.5, 1], false);
    const midLayer = createStars(90, [1, 1.5], false);
    const nearLayer = createStars(25, [1.5, 2.5], true);

    let animationId: number;
    let globalRot = 0;

    const render = (time: number) => {
      // Clear with dark navy
      ctx.fillStyle = "#02030a";
      ctx.fillRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(cx, cy);
      
      if (!isReducedMotion) {
        globalRot = (time * 0.00005) % (Math.PI * 2); // very slow constant drift
        ctx.rotate(globalRot);
      }

      // Draw Far
      ctx.globalAlpha = 0.6;
      farLayer.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // Draw Mid
      ctx.globalAlpha = 1;
      midLayer.forEach(star => {
        const t = time + star.timeOffset;
        const alpha = isReducedMotion ? star.origAlpha : star.origAlpha * (0.6 + 0.4 * Math.sin(t * 0.001));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw Near
      nearLayer.forEach(star => {
        if (!isReducedMotion) {
          star.x = star.x + 0.02;
          if (star.x > cx) star.x = -cx;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.origAlpha})`;
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      if (!isReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    const handleResize = () => {
      window.location.reload();
    };
    
    let resizeTimer: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 500);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#02030a]">
      {/* Nebulas */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "radial-gradient(circle, #3b1d6e 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "radial-gradient(circle, #0b3a6e 0%, transparent 70%)" }}
      />
      
      {/* Star layers combined in one canvas for performance */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          scale: baseScale,
          rotate: rotation,
        }}
      >
        <canvas
          ref={canvasRef}
          className="max-w-none max-h-none"
          style={{ width: "150vw", height: "150vh" }}
        />
      </motion.div>
    </div>
  );
}
