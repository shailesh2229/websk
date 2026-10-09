"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { Globe, ArrowRight } from "lucide-react";

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
  return (
    <>
      <main className="w-full bg-[#ffffff] pt-[17vw] min-h-screen">
        {/* Intro */}
        <div className="w-full relative mb-[8vw]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[6vw] font-normal leading-[1.1] text-[#1c1d20]"
            style={{ paddingLeft: "16vw", width: "90vw" }}
          >
            I'm a freelance designer and developer blending creativity
            <br />
            with code.
          </motion.h1>
        </div>

        {/* Divider and globe button */}
        <div className="relative w-full mb-[12vw] mt-[4vw]">
          <div
            className="h-[1px] bg-[#d5d5d5] absolute top-0"
            style={{ left: "16vw", width: "68vw" }}
          />
          <div
            className="absolute top-0 -translate-y-1/2 z-10"
            style={{ left: "72vw", transform: "translate(-50%, -50%)" }}
          >
            <RoundedButton
              href="#"
              className="w-[12vw] h-[12vw] bg-[#3A4BE0] text-white flex items-center justify-center text-[1.2vw]"
              fillColor="#2B38C4"
            >
              <Globe className="w-[3vw] h-[3vw] stroke-[1]" />
            </RoundedButton>
          </div>
        </div>

        {/* Portrait & Text */}
        <div className="w-full relative flex mb-[16vw]">
          <ArrowRight
            className="absolute text-[#1c1d20] stroke-[1]"
            style={{ width: "1.5vw", height: "1.5vw", left: "5vw", top: "0" }}
          />

          <div
            className="flex flex-col"
            style={{ paddingLeft: "16vw", width: "37vw" }}
          >
            <p className="text-[1.2vw] font-normal leading-[1.5] text-[#1c1d20] w-[21vw] mb-[4vw]">
              Hi, I'm Shailesh.
              <br />
              <br />I specialize in designing and building custom websites that
              are fast, accessible, and visually striking. My approach focuses
              on creating unique digital experiences rather than relying on
              generic templates.
            </p>
            <div className="flex flex-wrap gap-[1vw] mb-[4vw] w-[21vw]">
              <span className="px-[1.5vw] py-[0.8vw] border border-[#1c1d20] rounded-full text-[0.9vw]">
                Full-Stack
              </span>
              <span className="px-[1.5vw] py-[0.8vw] border border-[#1c1d20] rounded-full text-[0.9vw]">
                AI-Accelerated Dev
              </span>
              <span className="px-[1.5vw] py-[0.8vw] border border-[#1c1d20] rounded-full text-[0.9vw]">
                Fast Shipping
              </span>
            </div>
            <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999]">
              Always exploring
            </span>
          </div>

          <div className="w-[55vw]" style={{ paddingRight: "8vw" }}>
            <div className="w-[54vw] aspect-[4/5] bg-[#e1e4e7] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-[#999] text-[1vw]">
                TODO: /public/about/portrait.jpg
              </div>
            </div>
          </div>
        </div>

        {/* Services Panel */}
        <div id="services" className="w-full bg-[#e1e4e7] py-[10vw]">
          <div
            className="w-full relative"
            style={{ paddingLeft: "16vw", paddingRight: "8vw" }}
          >
            <h2 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#1c1d20] mb-[6vw]">
              I CAN HELP YOU WITH
            </h2>

            <div className="flex gap-[3vw]">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col flex-1 border-t border-[#1c1d20] pt-[1.5vw]"
                >
                  <span className="text-[0.9vw] text-[#1c1d20] mb-[3vw]">
                    {s.id}
                  </span>
                  <h3 className="text-[2.2vw] font-normal text-[#1c1d20] leading-[1.1] mb-[3vw]">
                    {s.title}
                  </h3>
                  <p className="text-[1.2vw] text-[#333] font-normal leading-[1.5] pr-[1vw]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="w-full bg-[#ffffff] py-[10vw]">
          <div
            className="w-full relative flex"
            style={{ paddingLeft: "16vw", paddingRight: "8vw" }}
          >
            <div className="w-[30%]">
              <h2 className="text-[3vw] font-normal leading-[1.2] text-[#1c1d20] sticky top-[10vw]">
                My Process
              </h2>
            </div>
            <div className="w-[70%] flex flex-col pl-[2vw]">
              {process.map((p) => (
                <div
                  key={p.id}
                  className="border-t border-[#e1e4e7] py-[4vw] flex gap-[4vw]"
                >
                  <span className="text-[0.9vw] text-[#999] w-[10%] pt-[0.5vw]">
                    {p.id}
                  </span>
                  <div className="flex flex-col w-[90%]">
                    <h3 className="text-[2.2vw] font-normal text-[#1c1d20] mb-[1.5vw]">
                      {p.title}
                    </h3>
                    <p className="text-[1.2vw] text-[#666] font-normal leading-[1.5] w-[70%]">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Us & Tools */}
        <div className="w-full bg-[#ffffff] pb-[10vw]">
          <div
            className="w-full relative flex border-t border-[#e1e4e7] pt-[6vw]"
            style={{ paddingLeft: "16vw", paddingRight: "8vw" }}
          >
            <div className="flex flex-col w-[50%]">
              <h2 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[4vw]">
                WHY US
              </h2>
              <ul className="flex flex-col gap-[1.5vw]">
                {whyUs.map((item, i) => (
                  <li
                    key={i}
                    className="text-[2.2vw] font-normal text-[#1c1d20] flex items-center gap-[1vw]"
                  >
                    <span className="w-[0.5vw] h-[0.5vw] rounded-full bg-[#1c1d20]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col w-[50%] pl-[2vw]">
              <h2 className="text-[0.65vw] tracking-[0.03em] uppercase text-[#999] mb-[4vw]">
                TOOLS
              </h2>
              <div className="flex flex-wrap gap-[0.8vw]">
                {tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-[1.5vw] py-[0.8vw] border border-[#e1e4e7] rounded-full text-[1.2vw] text-[#1c1d20]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rotating Badge Area */}
        <div className="w-full h-[50vw] bg-[#e1e4e7] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center text-[#999] text-[1vw]">
            TODO: Add parallax photo /public/about/studio.jpg
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-[10vw] h-[10vw] rounded-full bg-white flex items-center justify-center z-10 p-[1vw]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="curve"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="transparent"
              />
              <text fontSize="12" letterSpacing="2.5" fill="#1c1d20">
                <textPath href="#curve">WEBSK • AVAILABLE FOR WORK •</textPath>
              </text>
            </svg>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
