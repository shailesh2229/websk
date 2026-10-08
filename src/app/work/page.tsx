"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const projects = [
  {
    slug: "shivkrupa",
    title: "Shivkrupa Enterprise",
    client: "Shivkrupa",
    location: "Ahmedabad",
    services: "Web Design, Development",
    year: "2026",
    category: "Development",
    image: "/work/shivkrupa.jpg" // TODO placeholder
  }
];

const categories = ["All", "Design", "Development"];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"list" | "grid">("list");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Floating cursor setup
  const cursorX = useSpring(0, { stiffness: 150, damping: 25, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 150, damping: 25, mass: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || view !== "list") return;
      const rect = containerRef.current.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left - 192); // 385/2 approx
      cursorY.set(e.clientY - rect.top - 192);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, view]);

  const filteredProjects = projects.filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <>
      <main className="w-full bg-[#ffffff] pt-32 md:pt-48 pb-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-[4vw]">
          
          {/* Header */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[clamp(48px,7vw,90px)] font-light leading-[1.1] text-[#1c1d20] mb-16 md:mb-24"
          >
            Websites built<br />with care.
          </motion.h1>

          {/* Controls: Filters & View Toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8 relative z-10">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === "All" ? projects.length : projects.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative px-6 py-3 rounded-full text-[14px] md:text-[16px] transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterBlob"
                        className="absolute inset-0 bg-[#3A4BE0] rounded-full"
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-1 ${isActive ? "text-white" : "text-[#1c1d20]"}`}>
                      {cat} <sup className="text-[10px] top-[-0.5em]">{count}</sup>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView("list")}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${view === "list" ? "bg-[#e1e4e7]" : "hover:bg-[#f0f0f0]"}`}
              >
                {/* List Icon */}
                <div className="flex flex-col gap-1 w-5">
                  <div className="h-[2px] bg-[#1c1d20] w-full" />
                  <div className="h-[2px] bg-[#1c1d20] w-full" />
                  <div className="h-[2px] bg-[#1c1d20] w-full" />
                </div>
              </button>
              <button 
                onClick={() => setView("grid")}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${view === "grid" ? "bg-[#e1e4e7]" : "hover:bg-[#f0f0f0]"}`}
              >
                {/* Grid Icon */}
                <div className="flex flex-wrap gap-[3px] w-5 h-5">
                  <div className="w-[8.5px] h-[8.5px] bg-[#1c1d20]" />
                  <div className="w-[8.5px] h-[8.5px] bg-[#1c1d20]" />
                  <div className="w-[8.5px] h-[8.5px] bg-[#1c1d20]" />
                  <div className="w-[8.5px] h-[8.5px] bg-[#1c1d20]" />
                </div>
              </button>
            </div>
          </div>

          {/* List View */}
          {view === "list" && (
            <div className="w-full relative" ref={containerRef}>
              <div className="hidden md:grid grid-cols-12 text-[12px] tracking-widest text-[#999] pb-4 border-b border-[#e1e4e7]">
                <div className="col-span-4">CLIENT</div>
                <div className="col-span-3">LOCATION</div>
                <div className="col-span-4">SERVICES</div>
                <div className="col-span-1 text-right">YEAR</div>
              </div>

              <div className="flex flex-col group">
                <AnimatePresence>
                  {filteredProjects.map((project, idx) => {
                    const isHovered = hoveredIdx === idx;
                    const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;
                    return (
                      <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Link
                          href={`/work/${project.slug}`}
                          onMouseEnter={() => setHoveredIdx(idx)}
                          onMouseLeave={() => setHoveredIdx(null)}
                          className="w-full border-b border-[#e1e4e7] py-6 md:py-8 flex flex-col md:grid md:grid-cols-12 items-start md:items-center relative z-10 transition-colors"
                        >
                          <motion.div 
                            className={`col-span-4 text-[clamp(24px,3vw,32px)] font-light leading-[1.2] transition-colors duration-500 mb-2 md:mb-0 ${isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"}`}
                            animate={{ x: isHovered ? 20 : 0 }}
                            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                          >
                            {project.title}
                          </motion.div>
                          <div className={`col-span-3 text-[14px] md:text-[16px] font-normal transition-colors duration-500 mb-1 md:mb-0 ${isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"}`}>
                            {project.location}
                          </div>
                          <div className={`col-span-4 text-[14px] md:text-[16px] font-normal transition-colors duration-500 mb-1 md:mb-0 ${isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"}`}>
                            {project.services}
                          </div>
                          <div className={`col-span-1 text-left md:text-right text-[14px] md:text-[16px] font-normal transition-colors duration-500 ${isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"}`}>
                            {project.year}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Floating Image Preview */}
              <motion.div
                className="absolute top-0 left-0 pointer-events-none z-50 flex items-center justify-center hidden md:flex"
                style={{
                  x: cursorX,
                  y: cursorY,
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: hoveredIdx !== null ? 1 : 0,
                    opacity: hoveredIdx !== null ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                  className="relative w-[385px] h-[385px] bg-[#e1e4e7] overflow-hidden"
                >
                  {hoveredIdx !== null && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center text-[#999] text-sm">
                        TODO: {filteredProjects[hoveredIdx].image}
                      </div>
                      <div className="absolute inset-0 m-auto w-[77px] h-[77px] bg-[#3A4BE0] rounded-full flex items-center justify-center text-white text-[14px]">
                        View
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link href={`/work/${project.slug}`} className="group block">
                      <div className="relative w-full aspect-[4/3] bg-[#e1e4e7] mb-6 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-[#999] text-sm transition-transform duration-700 group-hover:scale-105">
                          TODO: {project.image}
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-[24px] font-light text-[#1c1d20] leading-[1.2]">{project.title}</h3>
                        <span className="text-[16px] text-[#1c1d20]">{project.year}</span>
                      </div>
                      <div className="text-[14px] text-[#999] mt-2 border-b border-[#e1e4e7] pb-6">
                        {project.services}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
