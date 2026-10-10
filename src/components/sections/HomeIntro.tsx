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
      className="w-full bg-[#ffffff] pt-[20vw] md:pt-[12vw] pb-0 relative"
    >
      <div 
        className="w-full flex flex-col md:flex-row relative px-[5vw] md:px-[8vw] md:pl-[16vw]"
      >
        
        {/* Left: Big Statement */}
        <div className="w-full md:w-[50vw] mb-[8vw] md:mb-0">
          <h2 className="text-[6vw] md:text-[2.8vw] font-normal leading-[1.4] md:leading-[1.3] text-[#1c1d20]">
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
        <div className="w-full md:w-[26vw] flex flex-row md:flex-col items-end md:items-start justify-between md:justify-normal md:gap-[4vw]">
          
          <p className="text-[4vw] md:text-[1.2vw] font-normal leading-[1.6] md:leading-[1.5] text-[#1c1d20] max-w-[56vw] md:max-w-none md:w-[21vw]">
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
            className="md:mt-[4vw] self-end relative md:right-[4vw] -mt-[4vw] right-[5vw] md:mr-0 -mr-[5vw]"
          >
            <RoundedButton
              href="/about"
              className="w-[34vw] h-[34vw] md:w-[12vw] md:h-[12vw] bg-[#1c1d20] text-[#ffffff] font-normal text-[4vw] md:text-[1.2vw]"
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
