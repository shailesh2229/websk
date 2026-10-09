"use client";

import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { RoundedButton } from "../ui/RoundedButton";
import { useRef } from "react";

export function HomeIntro() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.35 });
  const prefersReducedMotion = useReducedMotion();

  const lineVariants: Variants = {
    hidden: { y: prefersReducedMotion ? "0%" : "100%" },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
        delay: i * 0.1,
      },
    }),
  };

  const pLineVariants: Variants = {
    hidden: { y: prefersReducedMotion ? "0%" : "100%" },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.15 + i * 0.1,
      },
    }),
  };

  return (
    <section 
      ref={containerRef} 
      className="w-full bg-[#ffffff] pt-[12vw] pb-0 relative"
    >
      <div className="w-full flex relative" style={{ paddingLeft: "16vw", paddingRight: "8vw" }}>
        
        {/* Left: Big Statement */}
        <div className="w-[50vw]">
          <h2 className="text-[2.8vw] font-normal leading-[1.3] text-[#1c1d20]">
            <span className="block overflow-hidden">
              <motion.span 
                custom={0} 
                variants={lineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                Crafting digital experiences
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                custom={1} 
                variants={lineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                that blend aesthetics
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                custom={2} 
                variants={lineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                with seamless performance.
              </motion.span>
            </span>
          </h2>
        </div>

        {/* Right: Paragraph + Button */}
        <div className="w-[26vw] flex flex-col items-start gap-[4vw]">
          <p className="text-[1.2vw] font-normal leading-[1.5] text-[#1c1d20] w-[21vw]">
            <span className="block overflow-hidden">
              <motion.span 
                custom={0} 
                variants={pLineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                Creative design and clean code,
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                custom={1} 
                variants={pLineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                from custom front-end and WordPress
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                custom={2} 
                variants={pLineVariants} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                className="block will-change-transform"
              >
                to e-commerce and SEO-ready builds.
              </motion.span>
            </span>
          </p>

          <motion.div
            initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
            className="mt-[4vw] self-end relative right-[4vw]"
          >
            <RoundedButton
              href="/about"
              className="w-[12vw] h-[12vw] bg-[#1c1d20] text-[#ffffff] font-normal text-[1.2vw]"
              fillColor="#3A4BE0"
            >
              About me
            </RoundedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
