"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

export function InteractiveCard({
  feature,
}: {
  feature: { num: string; title: string; desc: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useSpring(0, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Calculate actual pixel positions for the glow
  const glowX = useSpring(0, { stiffness: 300, damping: 20 });
  const glowY = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // Normalized for rotation
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(nx);
    mouseY.set(ny);

    // Pixel coords for glow
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    // Reset glow to center
    if (ref.current) {
      glowX.set(ref.current.offsetWidth / 2);
      glowY.set(ref.current.offsetHeight / 2);
    }
  };

  const [isHoverable, setIsHoverable] = useState(false);
  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover)").matches);
  }, []);

  const background = useMotionTemplate`radial-gradient(350px circle at ${glowX}px ${glowY}px, var(--glow-color, rgba(255,255,255,0.06)), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={isHoverable ? handleMouseMove : undefined}
      onMouseEnter={isHoverable ? handleMouseEnter : undefined}
      onMouseLeave={isHoverable ? handleMouseLeave : undefined}
      style={{
        rotateX: isHoverable && hovered ? rotateX : 0,
        rotateY: isHoverable && hovered ? rotateY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative flex flex-col gap-3 bg-card p-8 rounded-2xl border border-border overflow-hidden transition-colors duration-300"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background,
        }}
      />

      <motion.div
        style={{ translateZ: isHoverable && hovered ? 25 : 0 }}
        className="relative z-10 flex flex-col gap-3 transition-transform duration-300 ease-out"
      >
        <span className="text-sm font-mono text-muted-foreground tabular-nums mb-2 block">
          {feature.num}
        </span>
        <h3 className="text-xl font-bold font-sans tracking-tight text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground font-sans leading-relaxed">
          {feature.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}
