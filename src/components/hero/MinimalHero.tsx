"use client";

import { motion } from "framer-motion";

interface MinimalHeroProps {
  title: string;
  subtitle: string;
  topText?: string;
  bottomText?: string;
}

export function MinimalHero({ title, subtitle, topText = "INITIATING SEQUENCE", bottomText = "SYSTEM.READY" }: MinimalHeroProps) {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] bg-[#030712] overflow-hidden flex items-center justify-center border-b border-white/5">
      {/* Faint Grid Lines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Corner Square Brackets */}
      <div className="absolute inset-8 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center h-full">
        {/* Top Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-16 text-xs text-white/40 font-mono uppercase tracking-widest"
        >
          {topText}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-7xl font-light tracking-tight text-white/90 font-sans leading-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/50 font-light">
            {subtitle}
          </p>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-16 text-xs text-white/40 font-mono uppercase tracking-widest"
        >
          {bottomText}
        </motion.div>
      </div>
    </section>
  );
}
