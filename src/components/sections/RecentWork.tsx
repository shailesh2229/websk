"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { RoundedButton } from "../ui/RoundedButton";

const projects = [
  {
    slug: "shivkrupa",
    title: "Shivkrupa Enterprise",
    discipline: "Design & Development",
    year: "2026",
    color: "#e1e4e7",
    image: "/work/shivkrupa.jpg", // TODO placeholder
  },
  {
    slug: "project-2",
    title: "Second Project",
    discipline: "Design & Development",
    year: "2025",
    color: "#d0d4d9",
    image: "/work/project2.jpg",
  },
  {
    slug: "project-3",
    title: "Third Project",
    discipline: "Design & Development",
    year: "2025",
    color: "#c0c4c9",
    image: "/work/project3.jpg",
  },
  {
    slug: "project-4",
    title: "Fourth Project",
    discipline: "Design & Development",
    year: "2024",
    color: "#b0b4b9",
    image: "/work/project4.jpg",
  },
];

export function RecentWork() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch devices skip custom cursor
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches)
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

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Enter / Leave List
  const handleMouseEnterList = () => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches)
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
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches)
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
    if (hoveredIdx !== null && sliderRef.current) {
      gsap.to(sliderRef.current, {
        y: `${hoveredIdx * -100}%`,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [hoveredIdx]);

  return (
    <section
      className="w-full bg-[#ffffff] pt-[2vw] md:pt-[0.5vw] pb-[20vw] md:pb-[8vw] relative"
      ref={containerRef}
      onMouseEnter={handleMouseEnterList}
      onMouseLeave={handleMouseLeaveList}
    >
      <div
        className="w-full relative px-[5vw] md:px-[8vw] md:pr-[8vw]"
      >
        {/* Label */}
        <div
          className="text-[4vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[6vw] md:mb-[3.1vw] pl-0 md:pl-[8vw]"
        >
          RECENT WORK
        </div>

        {/* Desktop Project List */}
        <div
          className="hidden md:flex border-t border-[#d5d5d5] flex-col group/list w-full"
          style={{ paddingLeft: "8vw", paddingRight: "0" }}
        >
          {projects.map((project, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`w-full border-b border-[#d5d5d5] h-[13.8vw] flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-400 cursor-none ${
                  isHovered ? "opacity-50" : "opacity-100"
                }`}
              >
                <h3
                  className="text-[4.1vw] font-normal m-0 leading-[1] text-[#1c1d20] transition-transform duration-400 ease-out"
                  style={{
                    transform: isHovered ? "translateX(-1vw)" : "translateX(0)",
                  }}
                >
                  {project.title}
                </h3>
                <div
                  className="text-[1.2vw] font-normal text-[#1c1d20] mt-[1vw] md:mt-0 transition-transform duration-400 ease-out"
                  style={{
                    transform: isHovered ? "translateX(1vw)" : "translateX(0)",
                  }}
                >
                  {project.discipline}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Project Cards */}
        <div className="flex md:hidden flex-col w-full">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="flex flex-col w-full mb-[18vw]"
            >
              <div className="w-full aspect-[1/0.92] bg-[#ececec] flex items-center justify-center mb-[3vw]">
                {/* Project Image Placeholder */}
                <div className="w-[85%] h-[85%] bg-[#d0d0d0] flex items-center justify-center text-[#999] text-[3vw]">
                  TODO: {project.image}
                </div>
              </div>
              <h3 className="text-[7.8vw] font-normal text-[#1c1d20] leading-[1.1] mb-[3vw]">
                {project.title}
              </h3>
              <div className="w-full h-[1px] bg-[#d5d5d5] mb-[3vw]" />
              <div className="w-full flex justify-between items-center text-[3.9vw] font-normal text-[#1c1d20]">
                <span>{project.discipline}</span>
                <span>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* More Work Button */}
        <div
          className="mt-[4vw] flex justify-center md:justify-start"
          style={{ paddingLeft: "0", paddingRight: "0" }} // We use inline class for padding on desktop below
        >
          <RoundedButton
            href="/work"
            className="w-[38vw] h-[12vw] md:w-auto md:h-auto md:px-[2vw] md:py-[1vw] border border-[#d0d0d0] text-[#1c1d20] hover:border-transparent rounded-full md:ml-[8vw]"
            fillColor="#3A4BE0"
          >
            <span className="flex items-center gap-[0.2vw] text-[4vw] md:text-[1.2vw]">
              More work{" "}
              <sup className="text-[2.5vw] md:text-[0.65vw] top-[-0.5em] ml-[0.2em]">
                {projects.length}
              </sup>
            </span>
          </RoundedButton>
        </div>
      </div>

      {/* Floating Modal (Fixed to viewport) */}
      <div
        ref={modalRef}
        className="fixed top-0 left-0 w-[27.5vw] h-[27.5vw] bg-[#e9eaea] overflow-hidden pointer-events-none z-50 scale-0 origin-center hidden md:block"
        style={{ transform: "translate(-50%, -50%) scale(0)" }}
      >
        <div ref={sliderRef} className="w-full h-full relative">
          {projects.map((p, i) => (
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
    </section>
  );
}
