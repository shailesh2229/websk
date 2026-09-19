"use client";

import { motion } from "framer-motion";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ContactSection } from "@/components/sections/ContactSection";

export function HomeSection() {
  return (
    <>
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center pt-[84px]">
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto w-full px-4 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center w-full max-w-[375px] md:max-w-none"
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white font-sans">
            WEBSK
          </h1>

          <div className="mt-8">
            <h2 
              className="font-[family-name:var(--font-ibm-plex)] font-bold text-[#f1f1f8] tracking-[-0.02em] leading-[1.08] text-[clamp(22px,3.6vw,52px)] text-balance mx-auto"
            >
              Your tech partner.<br />Shailesh.
            </h2>
            <p 
              className="font-[family-name:var(--font-ibm-plex)] font-normal text-[#c9cade] text-[clamp(13px,1.05vw,16px)] leading-[1.7] max-w-[520px] mx-auto mt-[18px] text-balance"
            >
              Custom websites, designed and coded from scratch. Fast, modern, and built for your business.
            </p>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#6a6e90] font-mono tracking-[0.28em] uppercase flex items-center gap-2 w-max pointer-events-none"
        >
          <span>[ Drag to rotate &bull; Scroll to zoom ]</span>
        </motion.div>
      </div>
    </section>
    
    <section className="py-24 border-b border-[#22254a] bg-transparent">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-light mb-8 font-sans">
          Crafting digital experiences with precision and passion.
        </h2>
        <div className="mt-12">
          <a href="/about" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('zoomNavigate', { detail: { url: '/about' } })); }} className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            More About Me
          </a>
        </div>
      </div>
    </section>

    <ServicesSection />
    
    <WorkSection />
    
    <ContactSection />
    </>
  );
}
