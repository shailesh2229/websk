"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "../ui/MagneticButton";
import Link from "next/link";

export function HomeIntro() {
  return (
    <section className="w-full bg-[#ffffff] pt-24 md:pt-40 pb-20 px-[4vw]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Left: Big Statement */}
        <div className="w-full md:w-[55%]">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[clamp(32px,4vw,42px)] font-light leading-[1.3] text-[#1c1d20]"
          >
            Web experiences<br />
            shaped by code,<br />
            not templates.
          </motion.h2>
        </div>

        {/* Right: Paragraph + Button */}
        <div className="w-full md:w-[40%] flex flex-col items-start md:items-end gap-12 md:pl-12">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="text-[clamp(16px,1.5vw,22px)] font-light leading-[1.5] text-[#1c1d20]"
          >
            Websk blends creative design with clean development to build modern digital products that engage and convert.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          >
            <MagneticButton>
              <Link 
                href="/about"
                className="group relative w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full bg-[#1c1d20] flex items-center justify-center overflow-hidden transition-colors"
              >
                <div className="absolute inset-0 bg-[#3A4BE0] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] rounded-full" />
                <span className="relative z-10 text-white font-normal text-[16px] md:text-[18px]">
                  About me
                </span>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
