"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";

function RotatingGlobe() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-[2.5vw] h-[2.5vw] stroke-white fill-transparent" 
      style={{ strokeWidth: 1.5, pointerEvents: "none" }}
    >
      <circle cx="50" cy="50" r="48" />
      <line x1="2" y1="50" x2="98" y2="50" />
      <motion.g 
        animate={prefersReducedMotion ? {} : { scaleX: [1, 0, -1, 0, 1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
        style={{ originX: "50px", originY: "50px" }}
      >
        <circle cx="50" cy="50" r="48" />
      </motion.g>
      <motion.g 
        animate={prefersReducedMotion ? {} : { scaleX: [0, -1, 0, 1, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
        style={{ originX: "50px", originY: "50px" }}
      >
        <circle cx="50" cy="50" r="48" />
      </motion.g>
    </svg>
  );
}

export function InteractiveGlobeButton() {
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch devices skip custom cursor effects
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (!btnRef.current) return;
    const btn = btnRef.current;

    // Use a proxy object for GSAP to animate instead of CSS vars directly if needed,
    // but gsap can tween CSS variables directly.
    const colorObj = { r: 60, g: 79, b: 228 };
    
    // We update the inline style manually in onUpdate for best performance
    const updateColor = () => {
      btn.style.backgroundColor = `rgb(${Math.round(colorObj.r)}, ${Math.round(colorObj.g)}, ${Math.round(colorObj.b)})`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const radius = rect.width / 2;
      
      const t = Math.max(0, Math.min(1, 1 - dist / radius));

      // idle blue: 60, 79, 228
      // purple: 125, 71, 161
      // crimson: 180, 65, 115
      
      let targetR = 60, targetG = 79, targetB = 228;
      
      if (t > 0) {
        if (t < 0.5) {
          const p = t * 2; 
          targetR = 60 + (125 - 60) * p;
          targetG = 79 + (71 - 79) * p;
          targetB = 228 + (161 - 228) * p;
        } else {
          const p = (t - 0.5) * 2; 
          targetR = 125 + (180 - 125) * p;
          targetG = 71 + (65 - 71) * p;
          targetB = 161 + (115 - 161) * p;
        }
      }

      gsap.to(colorObj, {
        r: targetR,
        g: targetG,
        b: targetB,
        duration: 0.1,
        ease: "none",
        onUpdate: updateColor
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(colorObj, {
        r: 60,
        g: 79,
        b: 228,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: updateColor
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);
    
    updateColor(); // set initial

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={btnRef}
      className="w-[9vw] h-[9vw] rounded-full flex items-center justify-center cursor-pointer absolute z-10 top-0 left-[72vw] -translate-x-1/2 -translate-y-1/2"
      style={{ backgroundColor: "rgb(60, 79, 228)" }}
    >
      <RotatingGlobe />
    </div>
  );
}
