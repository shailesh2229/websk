"use client";

import { motion, useTransform } from "framer-motion";
import { useZoom } from "./ZoomContext";
import { HomeSection } from "@/components/sections/HomeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { useEffect, useState } from "react";

const pages = [
  { id: 0, component: HomeSection },
  { id: 1, component: AboutSection },
  { id: 2, component: ServicesSection },
  { id: 3, component: WorkSection },
];

function ZoomLayer({ index, Component }: { index: number; Component: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { progress } = useZoom();
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Zooming IN to this page: progress goes from index-1 to index.
  // Zooming PAST this page: progress goes from index to index+1.
  
  const opacity = useTransform(
    progress,
    [index - 1, index, index + 1],
    [0, 1, 0]
  );

  const scale = useTransform(
    progress,
    [index - 1, index, index + 1],
    reduce ? [1, 1, 1] : [0.92, 1.0, 1.08]
  );

  const pointerEvents = useTransform(progress, (p) => {
    // Only allow interactions if this page is fully active
    return Math.abs(p - index) < 0.1 ? "auto" : "none";
  });

  const display = useTransform(progress, (p) => {
    // Hide completely if far away to save rendering costs
    return Math.abs(p - index) > 1.5 ? "none" : "block";
  });

  return (
    <motion.div
      style={{
        opacity,
        scale,
        pointerEvents,
        display,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: index + 10,
      }}
      className="scrollable-layer overflow-y-auto overflow-x-hidden h-full w-full"
    >
      <Component />
    </motion.div>
  );
}

export function ZoomLayers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pages.map((page) => (
        <ZoomLayer key={page.id} index={page.id} Component={page.component} />
      ))}
    </div>
  );
}
