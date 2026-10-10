"use client";

import { useEffect, useState, useRef } from "react";
import { RoundedButton } from "../ui/RoundedButton";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownLeft } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const [time, setTime] = useState("");
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const curveHeight = useTransform(scrollYProgress, [0, 1], ["15vw", "0vw"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-300px", "0px"]);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " IST",
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full bg-[#1c1d20] text-white pt-[20vw] pb-[2vw] z-0 overflow-hidden"
    >
      {/* Curved top edge to transition from white section to dark footer */}
      <motion.div
        className="absolute top-0 left-0 right-0 w-full bg-[#ffffff] pointer-events-none"
        style={{
          height: curveHeight,
          borderBottomLeftRadius: "50% 50%",
          borderBottomRightRadius: "50% 50%",
        }}
      />

      <motion.div className="w-full relative" style={{ y: yParallax }}>
        {/* Heading Section */}
        <div className="w-full flex md:px-0 px-[5vw] pl-[5vw] md:pl-[16vw]">
          <h2 className="text-[10vw] md:text-[6.2vw] font-normal leading-[1.15] md:leading-[1.1] tracking-[-0.02em] text-[#ffffff] flex flex-wrap items-center">
            <div className="w-[10.5vw] h-[10.5vw] md:w-[5.2vw] md:h-[5.2vw] rounded-full bg-[#8b9193] mr-[2vw] shrink-0 inline-block overflow-hidden relative align-middle">
              <Image src="/shailesh-avatar.png" alt="Shailesh" fill className="object-cover object-center" sizes="120px" quality={100} />
            </div>
            <span className="inline-block align-middle">Let's work</span>
            <div className="w-full" />
            <span className="inline-block align-middle">together</span>
          </h2>
        </div>

        {/* Divider and Get in Touch Button & Arrow */}
        <div className="relative w-full mt-[10vw] md:mt-[8vw]">
          <div
            className="absolute top-0 h-[1px] bg-[rgba(255,255,255,0.2)] md:left-[16vw] md:right-[16vw] left-[5vw] right-[5vw]"
          />

          <ArrowDownLeft
            className="hidden md:block absolute text-white stroke-[1]"
            style={{
              width: "1.3vw",
              height: "1.3vw",
              right: "17vw",
              bottom: "100%",
              marginBottom: "1vw",
            }}
          />

          {/* Button on the line */}
          <div
            className="absolute top-0 -translate-y-1/2 z-10 right-[6vw] md:right-auto md:left-[72.3vw] md:-translate-x-1/2"
          >
            <RoundedButton
              href="/contact"
              className="w-[34vw] h-[34vw] md:w-[12vw] md:h-[12vw] bg-[#3A4BE0] text-[#ffffff] font-normal text-[4vw] md:text-[1.2vw]"
              fillColor="#2B38C4"
            >
              Get in touch
            </RoundedButton>
          </div>

          {/* Pills Below */}
          <div
            className="w-full flex flex-col md:flex-row items-center pt-[10vw] md:pt-[4vw] px-[5vw] md:pl-[16vw] gap-[3vw] md:gap-[0.6vw]"
          >
            <RoundedButton
              href="mailto:websk2026@gmail.com"
              className="w-full md:w-auto h-[16vw] md:h-[4.7vw] md:px-[2vw] border border-[rgba(255,255,255,0.2)] rounded-full text-[4vw] md:text-[1.2vw] text-[#ffffff] flex items-center justify-center"
              fillColor="#3A4BE0"
            >
              websk2026@gmail.com
            </RoundedButton>
            <RoundedButton
              href="#"
              className="w-full md:w-auto h-[16vw] md:h-[4.7vw] md:px-[2vw] border border-[rgba(255,255,255,0.2)] rounded-full text-[4vw] md:text-[1.2vw] text-[#ffffff] flex items-center justify-center"
              fillColor="#3A4BE0"
            >
              +91 (000) 000-0000
            </RoundedButton>
          </div>
        </div>

        {/* Mobile Socials Row (Moved to match mobile spec, hidden on desktop here, shown on bottom on desktop) */}
        <div className="w-full flex md:hidden flex-col items-start mt-[12vw] px-[5vw]">
          <span className="text-[2.5vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[2vw]">
            SOCIALS
          </span>
          <div className="flex items-center gap-[5vw]">
            <a href="#" className="text-[4vw] text-[#ffffff]">LinkedIn</a>
            <a href="#" className="text-[4vw] text-[#ffffff]">GitHub</a>
            <a href="#" className="text-[4vw] text-[#ffffff]">Instagram</a>
          </div>
        </div>
        
        {/* 1px divider for mobile */}
        <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)] mt-[8vw] md:hidden px-[5vw] ml-[5vw] max-w-[90vw]" />

        {/* Bottom Meta Row */}
        <div
          className="w-full flex items-end justify-between mt-[4vw] md:mt-[12vw] px-[5vw] md:pl-[2.8vw] md:pr-[3vw]"
        >
          <div className="flex w-full md:w-auto justify-between md:justify-start items-start md:gap-[2vw]">
            <div className="flex flex-col">
              <span className="text-[2.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
                VERSION
              </span>
              <span className="text-[4vw] md:text-[1vw] text-[#ffffff]">2026 © Edition</span>
            </div>
            <div className="flex flex-col text-right md:text-left">
              <span className="text-[2.5vw] md:text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
                LOCAL TIME
              </span>
              <span className="text-[4vw] md:text-[1vw] text-[#ffffff]">
                {time || "Loading..."}
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
              SOCIALS
            </span>
            <div className="flex items-center gap-[2vw]">
              <a href="#" className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity">LinkedIn</a>
              <a href="#" className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity">GitHub</a>
              <a href="#" className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity">Instagram</a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
