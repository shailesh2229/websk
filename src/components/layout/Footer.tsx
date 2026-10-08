"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "../ui/MagneticButton";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative w-full bg-[#1c1d20] text-white pt-24 pb-8 overflow-hidden z-0">
      {/* Curved top edge to transition from white section to dark footer */}
      <div 
        className="absolute top-0 left-0 right-0 h-[100px] w-full bg-[#ffffff]"
        style={{
          borderBottomLeftRadius: "50% 100%",
          borderBottomRightRadius: "50% 100%",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-[4vw] mt-12 md:mt-24">
        {/* Heading Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 mb-20">
          <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full bg-[#333] overflow-hidden relative shrink-0">
            {/* TODO: Add real avatar here */}
            {/* <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" /> */}
          </div>
          <h2 className="text-[clamp(48px,7vw,90px)] font-light leading-[1.1] tracking-tight">
            Let&apos;s work<br />together
          </h2>
        </div>

        {/* Divider and Get in Touch Button */}
        <div className="relative border-t border-[#333] pt-6 mb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="text-[24px]">↙</div>
          
          <div className="absolute top-0 right-0 -translate-y-1/2">
            <MagneticButton>
              <Link 
                href="/contact"
                className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] bg-[#3A4BE0] rounded-full flex items-center justify-center text-white text-[16px] md:text-[18px] transition-transform hover:scale-105"
              >
                Get in touch
              </Link>
            </MagneticButton>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-12 md:mt-0">
            <a href="mailto:websk2026@gmail.com" className="border border-[#333] rounded-full px-6 py-4 text-[14px] md:text-[16px] hover:bg-white hover:text-[#1c1d20] transition-colors text-center">
              websk2026@gmail.com
            </a>
            <a href="#" className="border border-[#333] rounded-full px-6 py-4 text-[14px] md:text-[16px] hover:bg-white hover:text-[#1c1d20] transition-colors text-center">
              +91 (000) 000-0000 {/* TODO: Phone */}
            </a>
          </div>
        </div>

        {/* Bottom Meta Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[14px] text-[#999] pt-8">
          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest mb-1">VERSION</span>
              <span>2026 © Edition</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest mb-1">LOCAL TIME</span>
              <span>{time || "Loading..."}</span>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <span className="text-[10px] tracking-widest mb-1 hidden md:block">SOCIALS</span>
            <div className="flex items-center gap-6 justify-between md:justify-start">
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
