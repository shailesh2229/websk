"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    slug: "shivkrupa",
    title: "Shivkrupa Enterprise",
    discipline: "Web Design, Development",
    year: "2026",
    image: "/work/shivkrupa.jpg" // TODO: Add actual image or placeholder
  }
];

export function RecentWork() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  // Floating cursor setup
  const cursorX = useSpring(0, { stiffness: 150, damping: 25, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 150, damping: 25, mass: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Center the floating image on cursor
      cursorX.set(e.clientX - rect.left - 192); // 385/2 approx
      cursorY.set(e.clientY - rect.top - 192);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <section className="w-full bg-[#ffffff] pt-12 pb-24 relative" ref={containerRef}>
      <div className="max-w-[1440px] mx-auto px-[4vw]">
        
        {/* Label */}
        <div className="text-[12px] tracking-widest text-[#999] mb-8">
          RECENT WORK
        </div>
        
        {/* Project List */}
        <div className="border-t border-[#e1e4e7] flex flex-col group">
          {projects.map((project, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;
            
            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="w-full border-b border-[#e1e4e7] py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between transition-colors relative"
              >
                <motion.h3 
                  className={`text-[clamp(42px,5vw,72px)] font-light m-0 leading-[1] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"
                  }`}
                  animate={{ x: isHovered ? 20 : 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                >
                  {project.title}
                </motion.h3>
                <div className={`text-[14px] md:text-[16px] font-normal transition-colors duration-500 mt-4 md:mt-0 ${
                  isOtherHovered ? "text-[#ccc]" : "text-[#1c1d20]"
                }`}>
                  {project.discipline}
                </div>
              </Link>
            );
          })}
        </div>

        {/* More Work Button */}
        <div className="mt-16 flex justify-center md:justify-start">
          <Link
            href="/work"
            className="group relative inline-flex items-center justify-center px-8 py-4 border border-[#1c1d20] rounded-full overflow-hidden transition-colors hover:border-[#3A4BE0]"
          >
            <div className="absolute inset-0 bg-[#3A4BE0] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] rounded-full" />
            <span className="relative z-10 text-[#1c1d20] group-hover:text-white font-normal text-[16px] flex items-center gap-1">
              More work <sup className="text-[10px] top-[-0.5em]">{projects.length}</sup>
            </span>
          </Link>
        </div>
      </div>

      {/* Floating Image Preview */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
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
          className="relative w-[300px] h-[300px] md:w-[385px] md:h-[385px] bg-[#e1e4e7] overflow-hidden hidden md:block"
        >
          {hoveredIdx !== null && (
            <>
              {/* <Image 
                src={projects[hoveredIdx].image}
                alt="Project Preview"
                fill
                className="object-cover"
              /> */}
              {/* TODO placeholder text */}
              <div className="absolute inset-0 flex items-center justify-center text-[#999] text-sm">
                TODO: {projects[hoveredIdx].image}
              </div>
              <div className="absolute inset-0 m-auto w-[77px] h-[77px] bg-[#3A4BE0] rounded-full flex items-center justify-center text-white text-[14px]">
                View
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
