"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

interface RoundedButtonProps {
  children: React.ReactNode;
  className?: string;
  fillColor?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
}

export function RoundedButton({
  children,
  className = "",
  fillColor = "#3A4BE0",
  href,
  onClick,
  type,
}: RoundedButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Media query to check if touch device
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (
      isTouch ||
      !containerRef.current ||
      !fillRef.current ||
      !labelRef.current
    )
      return;

    const el = containerRef.current;
    const label = labelRef.current;
    const fill = fillRef.current;

    // QuickTo for magnetic move
    const xTo = gsap.quickTo(el, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    // QuickTo for label parallax
    const xLabelTo = gsap.quickTo(label, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yLabelTo = gsap.quickTo(label, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      xTo((clientX - centerX) * 0.35);
      yTo((clientY - centerY) * 0.35);

      xLabelTo((clientX - centerX) * 0.35 * 1.2);
      yLabelTo((clientY - centerY) * 0.35 * 1.2);
    };

    const handleMouseEnter = () => {
      // Kill tweens on fill
      gsap.killTweensOf(fill);
      // Reset position to bottom just in case
      gsap.set(fill, { top: "100%", width: "150%" });
      // Animate up
      gsap.to(fill, {
        top: "-25%",
        width: "150%",
        duration: 0.4,
        ease: "power3.in",
      });
    };

    const handleMouseLeave = () => {
      // Magnetic reset
      xTo(0);
      yTo(0);
      xLabelTo(0);
      yLabelTo(0);

      // Fill animation exit
      gsap.killTweensOf(fill);
      gsap.to(fill, {
        top: "-150%",
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(fill, { top: "100%" });
        },
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const inner = (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-full inline-flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <span
        ref={fillRef}
        className="absolute left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-[50%] top-full pointer-events-none"
        style={{ backgroundColor: fillColor }}
      />
      <span
        ref={labelRef}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group">
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className="group outline-none">
      {inner}
    </button>
  );
}
