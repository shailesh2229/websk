"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { RoundedButton } from "@/components/ui/RoundedButton";

const projects = [
  {
    slug: "shivkrupa",
    title: "Shivkrupa Enterprise",
    client: "Shivkrupa",
    location: "Ahmedabad",
    services: "Web Design, Development",
    year: "2026",
    category: "Development",
    color: "#e1e4e7",
    image: "/work/shivkrupa.jpg", // TODO placeholder
  },
  {
    slug: "project-2",
    title: "Second Project",
    client: "Unknown",
    location: "Remote",
    services: "Creative Development",
    year: "2025",
    category: "Design",
    color: "#d0d4d9",
    image: "/work/project2.jpg",
  },
];

const categories = ["All", "Design", "Development"];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"list" | "grid">("list");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory,
  );

  useEffect(() => {
    // Touch devices skip custom cursor
    if (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      view !== "list"
    )
      return;
    if (!modalRef.current || !bubbleRef.current || !containerRef.current)
      return;

    const modal = modalRef.current;
    const bubble = bubbleRef.current;
    const container = containerRef.current;

    const xModalTo = gsap.quickTo(modal, "left", {
      duration: 0.8,
      ease: "power3",
    });
    const yModalTo = gsap.quickTo(modal, "top", {
      duration: 0.8,
      ease: "power3",
    });

    const xBubbleTo = gsap.quickTo(bubble, "left", {
      duration: 0.5,
      ease: "power3",
    });
    const yBubbleTo = gsap.quickTo(bubble, "top", {
      duration: 0.5,
      ease: "power3",
    });

    const handleMouseMove = (e: MouseEvent) => {
      xModalTo(e.clientX);
      yModalTo(e.clientY);
      xBubbleTo(e.clientX);
      yBubbleTo(e.clientY);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [view]);

  // Enter / Leave List
  const handleMouseEnterList = () => {
    if (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      view !== "list"
    )
      return;
    gsap.to(modalRef.current, { scale: 1, duration: 0.4, ease: "custom" });
    gsap.to(bubbleRef.current, { scale: 1, duration: 0.4, ease: "custom" });
    if (modalRef.current)
      modalRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.76,0,0.24,1)";
    if (bubbleRef.current)
      bubbleRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.76,0,0.24,1)";
  };

  const handleMouseLeaveList = () => {
    if (
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      view !== "list"
    )
      return;
    setHoveredIdx(null);
    if (modalRef.current)
      modalRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.32,0,0.67,0)";
    if (bubbleRef.current)
      bubbleRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.32,0,0.67,0)";
    gsap.to(modalRef.current, { scale: 0, duration: 0.4 });
    gsap.to(bubbleRef.current, { scale: 0, duration: 0.4 });
  };

  // Slider change
  useEffect(() => {
    if (hoveredIdx !== null && sliderRef.current && view === "list") {
      gsap.to(sliderRef.current, {
        y: `${hoveredIdx * -100}%`,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [hoveredIdx, view]);

  return (
    <>
      <main className="w-full bg-[#ffffff] pt-[17vw] min-h-screen">
        <div className="w-full relative">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[6.2vw] font-normal leading-[1.05] text-[#1c1d20] mb-[4vw]"
            style={{ paddingLeft: "16vw" }}
          >
            Websites built
            <br />
            with care.
          </motion.h1>

          {/* Controls: Filters & View Toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[4vw] relative z-10 w-full">
            <div
              className="flex flex-wrap items-center"
              style={{ paddingLeft: "16vw", gap: "0.7vw" }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count =
                  cat === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length;
                return (
                  <RoundedButton
                    key={cat}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(cat);
                    }}
                    className={`h-[4.7vw] px-[2vw] rounded-full text-[1.2vw] transition-colors border ${
                      isActive
                        ? "bg-[#1c1d20] text-[#ffffff] border-[#1c1d20]"
                        : "bg-transparent text-[#1c1d20] border-[#d0d0d0]"
                    }`}
                    fillColor="#3A4BE0"
                  >
                    {cat}{" "}
                    <sup className="text-[0.6em] top-[-0.5em] ml-[0.2em]">
                      {count}
                    </sup>
                  </RoundedButton>
                );
              })}
            </div>

            <div
              className="flex items-center gap-[0.7vw]"
              style={{ paddingRight: "16vw" }}
            >
              <RoundedButton
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("list");
                }}
                className={`w-[4.7vw] h-[4.7vw] rounded-full flex items-center justify-center transition-colors border ${
                  view === "list"
                    ? "bg-[#1c1d20] text-[#ffffff] border-[#1c1d20]"
                    : "bg-transparent border-[#d0d0d0] text-[#1c1d20]"
                }`}
                fillColor="#3A4BE0"
              >
                {/* List Icon */}
                <div className="flex flex-col gap-[3px] w-[35%]">
                  <div
                    className={`h-[2px] w-full ${view === "list" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                  <div
                    className={`h-[2px] w-full ${view === "list" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                  <div
                    className={`h-[2px] w-full ${view === "list" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                </div>
              </RoundedButton>
              <RoundedButton
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("grid");
                }}
                className={`w-[4.7vw] h-[4.7vw] rounded-full flex items-center justify-center transition-colors border ${
                  view === "grid"
                    ? "bg-[#1c1d20] text-[#ffffff] border-[#1c1d20]"
                    : "bg-transparent border-[#d0d0d0] text-[#1c1d20]"
                }`}
                fillColor="#3A4BE0"
              >
                {/* Grid Icon */}
                <div className="flex flex-wrap gap-[3px] w-[40%] aspect-square">
                  <div
                    className={`w-[calc(50%-1.5px)] h-[calc(50%-1.5px)] ${view === "grid" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                  <div
                    className={`w-[calc(50%-1.5px)] h-[calc(50%-1.5px)] ${view === "grid" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                  <div
                    className={`w-[calc(50%-1.5px)] h-[calc(50%-1.5px)] ${view === "grid" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                  <div
                    className={`w-[calc(50%-1.5px)] h-[calc(50%-1.5px)] ${view === "grid" ? "bg-[#ffffff]" : "bg-current"}`}
                  />
                </div>
              </RoundedButton>
            </div>
          </div>

          {/* List View */}
          {view === "list" && (
            <div
              className="w-full relative pb-[12vw]"
              ref={containerRef}
              onMouseEnter={handleMouseEnterList}
              onMouseLeave={handleMouseLeaveList}
            >
              <div className="w-full relative text-[0.65vw] tracking-widest text-[#999] uppercase pb-[1vw]">
                <div className="absolute top-0 left-[16vw]">CLIENT</div>
                <div className="absolute top-0 left-[45vw]">LOCATION</div>
                <div className="absolute top-0 left-[61.7vw]">SERVICES</div>
                <div className="absolute top-0 right-[16vw]">YEAR</div>
              </div>
              <div
                className="h-[1px] bg-[#d5d5d5] w-full mt-[1.5vw] mb-0 absolute"
                style={{ left: "8vw", width: "84vw" }}
              />

              <div className="flex flex-col group/list mt-[1.5vw] relative w-full">
                <AnimatePresence>
                  {filteredProjects.map((project, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                      <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                      >
                        <Link
                          href={`/work/${project.slug}`}
                          onMouseEnter={() => setHoveredIdx(idx)}
                          className={`w-full h-[7.2vw] flex items-center relative z-10 transition-all duration-400 cursor-none border-b border-[#d5d5d5] ${
                            isHovered ? "opacity-50" : "opacity-100"
                          }`}
                          style={{
                            margin: "0 auto",
                            width: "84vw",
                            marginLeft: "8vw",
                          }}
                        >
                          <div
                            className="absolute text-[2.2vw] font-normal text-[#1c1d20] transition-transform duration-400 ease-out"
                            style={{
                              left: "8vw",
                              transform: isHovered
                                ? "translateX(-1vw)"
                                : "translateX(0)",
                            }}
                          >
                            {project.title}
                          </div>
                          <div
                            className="absolute text-[1.2vw] font-normal text-[#1c1d20] transition-transform duration-400 ease-out"
                            style={{
                              left: "37vw",
                              transform: isHovered
                                ? "translateX(1vw)"
                                : "translateX(0)",
                            }}
                          >
                            {project.location}
                          </div>
                          <div
                            className="absolute text-[1.2vw] font-normal text-[#1c1d20] transition-transform duration-400 ease-out"
                            style={{
                              left: "53.7vw",
                              transform: isHovered
                                ? "translateX(1vw)"
                                : "translateX(0)",
                            }}
                          >
                            {project.services}
                          </div>
                          <div
                            className="absolute right-[8vw] text-[1.2vw] font-normal text-[#1c1d20] transition-transform duration-400 ease-out"
                            style={{
                              transform: isHovered
                                ? "translateX(1vw)"
                                : "translateX(0)",
                            }}
                          >
                            {project.year}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Floating Modal (Fixed to viewport) */}
              <div
                ref={modalRef}
                className="fixed top-0 left-0 w-[27.5vw] h-[27.5vw] bg-[#e9eaea] overflow-hidden pointer-events-none z-50 scale-0 origin-center hidden md:block"
                style={{ transform: "translate(-50%, -50%) scale(0)" }}
              >
                <div ref={sliderRef} className="w-full h-full relative">
                  {filteredProjects.map((p, i) => (
                    <div
                      key={i}
                      className="w-full h-full flex items-center justify-center relative bg-[#e9eaea]"
                    >
                      <div className="w-[85%] aspect-[16/10] bg-[#d0d0d0] flex items-center justify-center text-[#999] text-[1vw]">
                        TODO: {p.image}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Bubble */}
              <div
                ref={bubbleRef}
                className="fixed top-0 left-0 w-[7vw] h-[7vw] bg-[#3A4BE0] rounded-full flex items-center justify-center text-[#ffffff] text-[1.2vw] pointer-events-none z-[51] scale-0 origin-center hidden md:flex"
                style={{ transform: "translate(-50%, -50%) scale(0)" }}
              >
                View
              </div>
            </div>
          )}

          {/* Grid View */}
          {view === "grid" && (
            <div className="w-[84vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[4vw] pb-[12vw]">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      className="group block"
                    >
                      <div className="relative w-full aspect-[4/3] bg-[#e1e4e7] mb-[2vw] overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-[#999] text-[1vw] transition-transform duration-700 group-hover:scale-105">
                          TODO: {project.image}
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-[2.2vw] font-normal text-[#1c1d20] leading-[1.2]">
                          {project.title}
                        </h3>
                        <span className="text-[1.2vw] text-[#1c1d20]">
                          {project.year}
                        </span>
                      </div>
                      <div className="text-[1.2vw] text-[#999] mt-[0.5vw] border-b border-[#e1e4e7] pb-[2vw]">
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
