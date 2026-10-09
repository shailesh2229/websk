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
        <div className="w-full flex" style={{ paddingLeft: "16vw" }}>
          <h2 className="text-[6.2vw] font-normal leading-[1.1] tracking-[-0.02em] text-[#ffffff] flex flex-wrap items-center">
            <div className="w-[5.2vw] h-[5.2vw] rounded-full bg-[#8b9193] mr-[2vw] shrink-0 inline-block overflow-hidden relative align-middle">
              <Image src="/shailesh-avatar.png" alt="Shailesh" fill className="object-cover object-center" sizes="120px" quality={100} />
            </div>
            <span className="inline-block align-middle">Let's work</span>
            <div className="w-full" />
            <span className="inline-block align-middle">together</span>
          </h2>
        </div>

        {/* Divider and Get in Touch Button & Arrow */}
        <div className="relative w-full mt-[8vw]">
          <div
            className="absolute top-0 h-[1px] bg-[rgba(255,255,255,0.2)]"
            style={{ left: "16vw", right: "16vw" }}
          />

          <ArrowDownLeft
            className="absolute text-white stroke-[1]"
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
            className="absolute top-0 -translate-y-1/2 z-10"
            style={{ left: "72.3vw", transform: "translate(-50%, -50%)" }}
          >
            <RoundedButton
              href="/contact"
              className="w-[12vw] h-[12vw] bg-[#3A4BE0] text-[#ffffff] font-normal text-[1.2vw]"
              fillColor="#2B38C4"
            >
              Get in touch
            </RoundedButton>
          </div>

          {/* Pills Below */}
          <div
            className="w-full flex items-center pt-[4vw]"
            style={{ paddingLeft: "16vw", gap: "0.6vw" }}
          >
            <RoundedButton
              href="mailto:websk2026@gmail.com"
              className="h-[4.7vw] px-[2vw] border border-[rgba(255,255,255,0.2)] rounded-full text-[1.2vw] text-[#ffffff]"
              fillColor="#3A4BE0"
            >
              websk2026@gmail.com
            </RoundedButton>
            <RoundedButton
              href="#"
              className="h-[4.7vw] px-[2vw] border border-[rgba(255,255,255,0.2)] rounded-full text-[1.2vw] text-[#ffffff]"
              fillColor="#3A4BE0"
            >
              +91 (000) 000-0000
            </RoundedButton>
          </div>
        </div>

        {/* Bottom Meta Row */}
        <div
          className="w-full flex items-end justify-between mt-[12vw]"
          style={{ paddingLeft: "2.8vw", paddingRight: "3vw" }}
        >
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <div className="flex flex-col">
              <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
                VERSION
              </span>
              <span className="text-[1vw] text-[#ffffff]">2026 © Edition</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
                LOCAL TIME
              </span>
              <span className="text-[1vw] text-[#ffffff]">
                {time || "Loading..."}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="text-[0.65vw] tracking-[0.03em] uppercase text-[rgba(255,255,255,0.5)] mb-[1vw]">
              SOCIALS
            </span>
            <div className="flex items-center" style={{ gap: "2vw" }}>
              <a
                href="#"
                className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-[1vw] text-[#ffffff] hover:opacity-70 transition-opacity"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
