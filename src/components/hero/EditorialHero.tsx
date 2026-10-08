"use client";

import Image from "next/image";
import { Globe, ArrowDownRight } from "lucide-react";

export function EditorialHero() {
  return (
    <section className="relative w-full h-[100dvh] bg-[#8E9193] overflow-hidden">
      
      {/* Middle Elements (Pill & Role text) */}
      
      {/* Left: Location Pill + Globe Badge */}
      <div className="hero-pill absolute left-0 top-[120px] md:top-[44%] z-20 flex items-center">
        <div className="bg-[#1f1f1f] text-white text-[14px] leading-[1.3] pl-4 md:pl-8 pr-5 py-3 md:py-4 rounded-r-full flex items-center shadow-lg">
          <div>
            Located<br />in<br />Ahmedabad
          </div>
          <div className="ml-4 bg-[#a9abad] w-[52px] h-[52px] rounded-full flex items-center justify-center text-[#111] shrink-0">
            <Globe className="w-6 h-6 animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Right: Role Text */}
      <div className="hero-role absolute right-6 top-[80px] md:left-[71%] md:top-[36%] z-20 flex flex-col items-end md:items-start text-white">
        <ArrowDownRight className="w-6 h-6 md:w-8 md:h-8 mb-2" strokeWidth={1.5} />
        <div className="font-light text-[clamp(20px,2.1vw,30px)] leading-[1.1] text-right md:text-left">
          Freelance Designer<br />& Developer
        </div>
      </div>

      {/* Portrait Photo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] md:w-[45vw] max-w-[600px] h-[75vh] md:h-[85vh] z-10 pointer-events-none">
        <Image
          src="/shailesh.png"
          alt="Shailesh Chaudhary"
          fill
          priority
          className="object-contain object-bottom"
        />
      </div>

      {/* Giant Bottom Text */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30 w-full px-4 md:px-0 pointer-events-none">
        <h1 className="text-white font-normal tracking-[-0.045em] leading-[0.9] text-[19vw] md:text-[11.2vw] flex flex-col md:flex-row items-center justify-center">
          <div className="overflow-hidden">
            <div className="hero-word">Shailesh</div>
          </div>
          <div className="overflow-hidden hidden md:flex items-center justify-center mx-[2vw] h-full">
            <div className="hero-dash bg-white w-[7.2vw] h-[0.55vw] rounded-full" />
          </div>
          <div className="overflow-hidden">
            <div className="hero-word">Chaudhary</div>
          </div>
        </h1>
      </div>

    </section>
  );
}
