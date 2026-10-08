"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";

const services = [
  { id: "01", title: "Web Development", desc: "Building fast, scalable, and responsive web applications tailored to your specific needs." },
  { id: "02", title: "UI / UX Design", desc: "Crafting intuitive and engaging user interfaces with a focus on seamless user experiences." },
  { id: "03", title: "Creative Development", desc: "Implementing smooth animations, micro-interactions, and immersive visual effects." },
  { id: "04", title: "Responsive Experiences", desc: "Ensuring flawless performance and layout integrity across all devices and screen sizes." }
];

const process = [
  { id: "01", title: "Discover", desc: "Understanding your goals, audience, and technical requirements." },
  { id: "02", title: "Define", desc: "Planning the architecture, user journey, and design system." },
  { id: "03", title: "Build", desc: "Developing the application with clean code and modern frameworks." },
  { id: "04", title: "Launch", desc: "Testing, optimization, and seamless deployment to production." }
];

const whyUs = [
  "Pixel-Perfect Implementation",
  "Performance Optimized",
  "Modern Tech Stack",
  "SEO Friendly Architecture",
  "Accessible Design",
  "Ongoing Support"
];

const tools = [
  "Next.js", "React", "JavaScript", "Tailwind", "HTML", "CSS", "WordPress", "WooCommerce", "Figma", "Git"
];

export default function AboutPage() {
  return (
    <>
      <main className="w-full bg-[#ffffff] pt-32 md:pt-48 pb-0 min-h-screen">
        
        {/* Intro */}
        <div className="max-w-[1440px] mx-auto px-[4vw] mb-32">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[clamp(48px,6vw,80px)] font-light leading-[1.1] text-[#1c1d20] w-full md:w-[80%]"
          >
            I&apos;m a freelance designer and developer blending creativity with code.
          </motion.h1>
        </div>

        {/* Portrait & Text */}
        <div className="max-w-[1440px] mx-auto px-[4vw] mb-32 flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="w-full md:w-1/3">
            <div className="w-full aspect-[3/4] bg-[#e1e4e7] relative overflow-hidden rounded-md">
              {/* TODO: Add portrait image */}
              <div className="absolute inset-0 flex items-center justify-center text-[#999] text-sm">
                TODO: /public/about/portrait.jpg
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h2 className="text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-[#1c1d20] mb-8">
              Hi, I&apos;m Shailesh.
            </h2>
            <p className="text-[18px] md:text-[22px] font-light leading-[1.6] text-[#1c1d20] mb-12 max-w-[800px]">
              I specialize in designing and building custom websites that are fast, accessible, and visually striking. My approach focuses on creating unique digital experiences rather than relying on generic templates.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-6 py-3 border border-[#1c1d20] rounded-full text-[14px]">Full-Stack</span>
              <span className="px-6 py-3 border border-[#1c1d20] rounded-full text-[14px]">AI-Accelerated Dev</span>
              <span className="px-6 py-3 border border-[#1c1d20] rounded-full text-[14px]">Fast Shipping</span>
            </div>
          </div>
        </div>

        {/* Services Panel */}
        <div id="services" className="w-full bg-[#e1e4e7] py-24 md:py-32 px-[4vw]">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-[12px] tracking-widest text-[#1c1d20] mb-16">I CAN HELP YOU WITH</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              {services.map((s) => (
                <div key={s.id} className="flex flex-col border-t border-[#1c1d20] pt-6">
                  <span className="text-[14px] text-[#1c1d20] mb-8">{s.id}</span>
                  <h3 className="text-[24px] font-light text-[#1c1d20] mb-6 line-clamp-2 min-h-[64px]">{s.title}</h3>
                  <p className="text-[16px] text-[#333] font-light leading-[1.5]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="w-full bg-[#ffffff] py-24 md:py-32 px-[4vw]">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 md:gap-32">
            <div className="w-full md:w-[30%]">
              <h2 className="text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-[#1c1d20] sticky top-32">
                My Process
              </h2>
            </div>
            <div className="w-full md:w-[70%] flex flex-col">
              {process.map((p) => (
                <div key={p.id} className="border-t border-[#e1e4e7] py-12 flex flex-col md:flex-row gap-8 md:gap-16">
                  <span className="text-[14px] text-[#999] md:w-[10%]">{p.id}</span>
                  <div className="flex flex-col md:w-[90%]">
                    <h3 className="text-[clamp(28px,3vw,36px)] font-light text-[#1c1d20] mb-4">{p.title}</h3>
                    <p className="text-[18px] text-[#666] font-light max-w-[500px]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Us & Tools */}
        <div className="w-full bg-[#ffffff] pb-24 md:pb-32 px-[4vw]">
          <div className="max-w-[1440px] mx-auto border-t border-[#e1e4e7] pt-24 grid grid-cols-1 md:grid-cols-2 gap-16">
            
            <div className="flex flex-col">
              <h2 className="text-[12px] tracking-widest text-[#999] mb-12">WHY US</h2>
              <ul className="flex flex-col gap-6">
                {whyUs.map((item, i) => (
                  <li key={i} className="text-[clamp(24px,2.5vw,32px)] font-light text-[#1c1d20] flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-[#1c1d20]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[12px] tracking-widest text-[#999] mb-12">TOOLS</h2>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, i) => (
                  <span key={i} className="px-6 py-3 border border-[#e1e4e7] rounded-full text-[16px] text-[#1c1d20]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Rotating Badge Area */}
        <div className="w-full h-[300px] bg-[#e1e4e7] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center text-[#999] text-sm">
            TODO: Add parallax photo /public/about/studio.jpg
          </div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center z-10 p-2"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text fontSize="12" letterSpacing="2.5" fill="#1c1d20">
                <textPath href="#curve">
                  WEBSK • AVAILABLE FOR WORK •
                </textPath>
              </text>
            </svg>
          </motion.div>
        </div>

      </main>
      <Footer />
    </>
  );
}
