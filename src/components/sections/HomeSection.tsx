"use client";

import { motion } from "framer-motion";

export function HomeSection() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pt-[84px] bg-transparent pb-24">
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto w-full px-4 h-full my-auto">
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
  );
}
