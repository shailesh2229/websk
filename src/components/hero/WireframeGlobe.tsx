"use client";

import { useEffect, useRef } from "react";

export function WireframeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let th = 0;
    const T = 0.38;

    const draw = () => {
      const S = canvas.width;
      const R = S * 0.46;

      ctx.clearRect(0, 0, S, S);
      
      // Outer circle
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = S * 0.045;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, R, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = S * 0.032;

      function pt(lat: number, lon: number) { 
        const X = Math.cos(lat) * Math.sin(lon);
        const Y = Math.sin(lat);
        const Z = Math.cos(lat) * Math.cos(lon);
        return { 
          x: X, 
          y: Y * Math.cos(T) - Z * Math.sin(T), 
          z: Y * Math.sin(T) + Z * Math.cos(T) 
        }; 
      }
      
      function line(fn: (t: number) => {x: number, y: number, z: number}, n: number) { 
        ctx!.beginPath(); 
        let pen = false;
        for(let i = 0; i <= n; i++) { 
          const q = fn(i / n); 
          if (q.z > 0) { 
            const px = S / 2 + q.x * R;
            const py = S / 2 - q.y * R; 
            if (pen) {
              ctx!.lineTo(px, py);
            } else {
              ctx!.moveTo(px, py);
            }
            pen = true;
          } else {
            pen = false; 
          }
        }
        ctx!.stroke(); 
      }

      // Meridians (12)
      for (let k = 0; k <= 11; k++) {
        line(t => pt(-Math.PI / 2 + t * Math.PI, k * Math.PI / 6 + th), 48);
      }
      
      // Latitude lines (5)
      for (let j = -2; j <= 2; j++) {
        line(t => pt(j * 0.5, t * 2 * Math.PI), 64);
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        th += 0.012;
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={100} 
      height={100} 
      className="w-[58%] h-[58%]" 
    />
  );
}
