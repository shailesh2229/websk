"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { InteractiveGlobeButton } from "@/components/about/InteractiveGlobeButton";

const services = [
  {
    id: "01",
    title: "Web Development",
    desc: "Building fast, scalable, and responsive web applications tailored to your specific needs.",
  },
  {
    id: "02",
    title: "UI / UX Design",
    desc: "Crafting intuitive and engaging user interfaces with a focus on seamless user experiences.",
  },
  {
    id: "03",
    title: "Creative Development",
    desc: "Implementing smooth animations, micro-interactions, and immersive visual effects.",
  },
  {
    id: "04",
    title: "Responsive Experiences",
    desc: "Ensuring flawless performance and layout integrity across all devices and screen sizes.",
  },
];

const process = [
  {
    id: "01",
    title: "Discover",
    desc: "Understanding your goals, audience, and technical requirements.",
  },
  {
    id: "02",
    title: "Define",
    desc: "Planning the architecture, user journey, and design system.",
  },
  {
    id: "03",
    title: "Build",
    desc: "Developing the application with clean code and modern frameworks.",
  },
  {
    id: "04",
    title: "Launch",
    desc: "Testing, optimization, and seamless deployment to production.",
  },
];

const whyUs = [
  "Pixel-Perfect Implementation",
  "Performance Optimized",
  "Modern Tech Stack",
  "SEO Friendly Architecture",
  "Accessible Design",
  "Ongoing Support",
];

const tools = [
  "Next.js",
  "React",
  "JavaScript",
  "Tailwind",
  "HTML",
  "CSS",
  "WordPress",
  "WooCommerce",
  "Figma",
  "Git",
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const prefersReducedMotion = useReducedMotion();
  const yPortrait = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-8%", "8%"]
  );

  return (
    <div ref={containerRef}>
      <main className="w-full bg-[#ffffff] pt-[28vw] md:pt-[17vw]">
        {/* Intro */}
        <div className="w-full relative mb-[8vw] md:mb-[12vw] px-[5vw] md:px-0">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[9.3vw] md:text-[6vw] font-normal leading-[1.2] md:leading-[1.1] text-[#1c1d20] md:pl-[16vw] md:w-[90vw]"
          >
            I'm a freelance designer and developer blending creativity
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            with code.
          </motion.h1>
        </div>

        {/* Divider and globe button */}
        <div className="relative w-full mb-[12vw]">
          <div
            className="h-[1px] bg-[#d5d5d5] absolute top-0 left-[5vw] right-[5vw] md:left-[16vw] md:w-[68vw] md:right-auto"
          />
          <div className="md:hidden absolute top-0 -translate-y-1/2 right-[7vw]">
            <InteractiveGlobeButton />
          </div>
          <div className="hidden md:block">
            <InteractiveGlobeButton />
          </div>
        </div>

        {/* Portrait & Text */}
        <div className="w-full relative flex flex-col md:flex-row mb-[20vw] md:mb-[12vw] px-[5vw] md:px-0">
          
          {/* Arrow */}
          <ArrowRight
            className="hidden md:block absolute text-[#1c1d20] stroke-[1]"
            style={{ width: "1.5vw", height: "1.5vw", left: "5vw", top: "0" }}
          />

          <div
            className="flex flex-col md:pl-[16vw] md:w-[37vw] w-full"
          >
            <ArrowRight
              className="md:hidden text-[#1c1d20] stroke-[1] w-[4vw] h-[4vw] mb-[3vw]"
            />
            <p className="text-[4vw] md:text-[1.2vw] font-normal leading-[1.6] md:leading-[1.5] text-[#1c1d20] w-full md:w-[21vw] mb-[8vw] md:mb-[4vw]">
              Hi, I'm Shailesh.
              <br />
              <br />I specialize in designing and building custom websites that
              are fast, accessible, and visually striking. My approach focuses
              on creating unique digital experiences rather than relying on
              generic templates.
            </p>
            <div className="h-[1px] bg-[#d5d5d5] w-full mb-[8vw] md:hidden" />
            <div className="flex flex-wrap gap-[2vw] md:gap-[1vw] mb-[6vw] md:mb-[4vw] w-full md:w-[21vw]">
              <span className="px-[4vw] md:px-[1.5vw] py-[2vw] md:py-[0.8vw] border border-[#1c1d20] rounded-full text-[3vw] md:text-[0.9vw]">
                Full-Stack
              </span>
              <span className="px-[4vw] md:px-[1.5vw] py-[2vw] md:py-[0.8vw] border border-[#1c1d20] rounded-full text-[3vw] md:text-[0.9vw]">
                AI-Accelerated Dev
              </span>
              <span className="px-[4vw] md:px-[1.5vw] py-[2vw] md:py-[0.8vw] border border-[#1c1d20] rounded-full text-[3vw] md:text-[0.9vw]">
                Fast Shipping
              </span>
            </div>
            <span className="text-[2.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[8vw] md:mb-0">
              Always exploring
            </span>
          </div>

          <div className="w-full md:w-[55vw] md:pr-[8vw]">
            <div className="w-full md:w-[54vw] aspect-[4/5] bg-[#e1e4e7] relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 w-full"
                style={{ y: yPortrait, height: "115%", top: "-7.5%" }}
              >
                <Image
                  src="/shailesh-avatar.png"
                  alt="Shailesh Portrait"
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                  quality={100}
                  className="object-cover"
                  style={{ objectPosition: "40% 30%" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Services Panel */}
        <div id="services" className="w-full bg-[#e1e4e7] py-[16vw] md:py-[10vw]">
          <div
            className="w-full relative px-[5vw] md:pl-[16vw] md:pr-[8vw]"
          >
            <h2 className="text-[3.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[#1c1d20] mb-[10vw] md:mb-[6vw]">
              I CAN HELP YOU WITH
            </h2>

            <div className="flex flex-col md:flex-row gap-[10vw] md:gap-[3vw]">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col md:flex-1 border-t border-[#1c1d20] pt-[4vw] md:pt-[1.5vw]"
                >
                  <span className="text-[2.5vw] md:text-[0.9vw] text-[#1c1d20] mb-[4vw] md:mb-[3vw]">
                    {s.id}
                  </span>
                  <h3 className="text-[6vw] md:text-[2.2vw] font-normal text-[#1c1d20] leading-[1.1] mb-[4vw] md:mb-[3vw]">
                    {s.title}
                  </h3>
                  <p className="text-[4vw] md:text-[1.2vw] text-[#333] font-normal leading-[1.6] md:leading-[1.5] md:pr-[1vw]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="w-full bg-[#ffffff] py-[16vw] md:py-[10vw]">
          <div
            className="w-full relative flex flex-col md:flex-row px-[5vw] md:pl-[16vw] md:pr-[8vw]"
          >
            <div className="w-full md:w-[30%] mb-[8vw] md:mb-0">
              <h2 className="text-[8vw] md:text-[3vw] font-normal leading-[1.2] text-[#1c1d20] md:sticky md:top-[10vw]">
                My Process
              </h2>
            </div>
            <div className="w-full md:w-[70%] flex flex-col md:pl-[2vw]">
              {process.map((p) => (
                <div
                  key={p.id}
                  className="border-t border-[#e1e4e7] py-[8vw] md:py-[4vw] flex gap-[4vw]"
                >
                  <span className="text-[3vw] md:text-[0.9vw] text-[#999] w-[10%] pt-[1vw] md:pt-[0.5vw]">
                    {p.id}
                  </span>
                  <div className="flex flex-col w-[90%]">
                    <h3 className="text-[6vw] md:text-[2.2vw] font-normal text-[#1c1d20] mb-[3vw] md:mb-[1.5vw]">
                      {p.title}
                    </h3>
                    <p className="text-[4vw] md:text-[1.2vw] text-[#666] font-normal leading-[1.6] md:leading-[1.5] w-[90%] md:w-[70%]">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Us & Tools */}
        <div className="w-full bg-[#ffffff]">
          <div
            className="w-full relative flex flex-col md:flex-row border-t border-[#e1e4e7] pt-[12vw] md:pt-[6vw] px-[5vw] md:pl-[16vw] md:pr-[8vw] pb-[16vw] md:pb-[10vw]"
          >
            <div className="flex flex-col w-full md:w-[50%] mb-[12vw] md:mb-0">
              <h2 className="text-[3.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[6vw] md:mb-[4vw]">
                WHY US
              </h2>
              <ul className="flex flex-col gap-[4vw] md:gap-[1.5vw]">
                {whyUs.map((item, i) => (
                  <li
                    key={i}
                    className="text-[6vw] md:text-[2.2vw] font-normal text-[#1c1d20] flex items-center gap-[3vw] md:gap-[1vw]"
                  >
                    <span className="w-[1.5vw] h-[1.5vw] md:w-[0.5vw] md:h-[0.5vw] rounded-full bg-[#1c1d20]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col w-full md:w-[50%] md:pl-[2vw]">
              <h2 className="text-[3.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[6vw] md:mb-[4vw]">
                TOOLS
              </h2>
              <div className="flex flex-wrap gap-[2vw] md:gap-[0.8vw]">
                {tools.map((tool, i) => (
                  <RoundedButton
                    key={i}
                    type="button"
                    className="px-[5vw] py-[2.5vw] md:px-[1.5vw] md:py-[0.8vw] border border-[#e1e4e7] rounded-full text-[4vw] md:text-[1.2vw] text-[#1c1d20] hover:border-transparent hover:text-white"
                    fillColor="#3A4BE0"
                  >
                    {tool}
                  </RoundedButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
