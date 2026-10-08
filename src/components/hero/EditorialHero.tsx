"use client";

import { WireframeGlobe } from "./WireframeGlobe";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export function EditorialHero() {
  return (
    <section className={`relative w-full h-[100svh] min-h-[640px] bg-[#8d9294] overflow-hidden ${inter.className}`}>
      <style>{`
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hero-marquee {
          animation: heroMarquee 50s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee {
            animation-play-state: paused;
          }
        }
        .hero-photo-img {
          object-fit: cover !important;
          object-position: 52% 0% !important;
        }
        @media (min-width: 768px) {
          .hero-photo-img {
            object-position: 50% 20% !important;
          }
        }
      `}</style>

      {/* Soft lighter radial glow behind the portrait */}
      <div 
        className="absolute inset-0 pointer-events-none z-[0]"
        style={{ background: "radial-gradient(ellipse 30% 55% at 50% 52%, rgba(168,172,172,.55), transparent 70%)" }}
      />
      
      {/* Portrait Photo Wrapper (Full-bleed via Next Image) */}
      <div 
        className="absolute left-0 right-0 bottom-0 w-full h-[72%] md:h-full z-[1] pointer-events-none"
      >
        <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#8d9294] to-transparent z-[2] block md:hidden" />
        <Image
          src="/shailesh-hero.png"
          alt="Shailesh Chaudhary"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hero-photo-img z-[1]"
        />
      </div>
      
      {/* Location Pill */}
      <div 
        className="hero-pill absolute left-0 z-20 flex items-center bg-[#17181a] top-[55%] md:top-[44%] scale-[0.85] md:scale-100 origin-left"
        style={{ 
          height: "clamp(60px, 7vw, 120px)",
          borderRadius: "0 999px 999px 0",
          paddingLeft: "3vw",
          paddingRight: "clamp(6px, 0.7vw, 12px)",
          gap: "2.3vw",
          color: "#ffffff"
        }}
      >
        <div 
          className="font-normal"
          style={{ 
            fontSize: "clamp(10px, 1.2vw, 20px)", 
            lineHeight: 1.18,
            color: "#ffffff"
          }}
        >
          Located<br />in<br />Ahmedabad
        </div>
        <div 
          className="bg-[#979a9a] rounded-full flex items-center justify-center shrink-0"
          style={{ 
            width: "clamp(44px, 5.3vw, 92px)",
            height: "clamp(44px, 5.3vw, 92px)",
          }}
        >
          <WireframeGlobe />
        </div>
      </div>

      {/* Role Text */}
      <div 
        className="hero-role absolute z-20 flex flex-col items-start left-6 top-[16%] md:left-[71.5%] md:top-[35%]"
        style={{ color: "#ffffff" }}
      >
        <div className="mb-2 text-sm md:text-base" style={{ color: "#ffffff" }}>↘</div>
        <div 
          className="font-normal text-left text-[clamp(18px,5vw,22px)] md:text-[clamp(16px,1.95vw,34px)]"
          style={{ lineHeight: 1.12, color: "#ffffff" }}
        >
          Freelance<br />Designer & Developer
        </div>
      </div>

      {/* Name Marquee */}
      <div 
        className="absolute left-0 right-0 z-[3] pointer-events-none overflow-hidden"
        style={{ bottom: "3%" }}
      >
        <div 
          className="hero-marquee inline-flex whitespace-nowrap font-normal will-change-transform"
          style={{ 
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            color: "#ffffff"
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="pr-[0.3em] text-[clamp(64px,20vw,120px)] md:text-[19vh]" style={{ color: "#ffffff" }}>
              Shailesh Chaudhary —
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
