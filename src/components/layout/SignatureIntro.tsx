"use client";

import { useState, useRef, useEffect } from "react";

let hasPlayed = false;

export function SignatureIntro() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [phase, setPhase] = useState<"play" | "fade" | "unmount">("play");
  const fadeFired = useRef(false);

  useEffect(() => {
    const forcePlay = window.location.search.includes("loader=1");
    if (hasPlayed && !forcePlay) {
      setShowPreloader(false);
      setPhase("unmount");
      window.dispatchEvent(new Event("shutterOpen"));
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce && !forcePlay) {
      setShowPreloader(false);
      setPhase("unmount");
      hasPlayed = true;
      window.dispatchEvent(new Event("shutterOpen"));
      return;
    }

    // After 1500ms, the intro finishes and we trigger the shutter
    const timeoutId = setTimeout(() => {
      setPhase("fade");
      window.dispatchEvent(new Event("shutterOpen")); // Tell GlobeHero to reveal
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (phase !== "fade" || e.propertyName !== "transform") return;
    if (fadeFired.current) return;
    fadeFired.current = true;
    
    setPhase("unmount");
    setShowPreloader(false);
    hasPlayed = true;
  };

  if (phase === "unmount" || !showPreloader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-none overflow-hidden">
      <div 
        onTransitionEnd={handleTransitionEnd}
        className={`relative z-10 flex flex-col items-center w-[min(92vw,520px)] text-center transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          phase === "fade" ? "-translate-y-[150vh]" : "translate-y-0"
        }`}
      >
        {/* Signature */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="sig w-[clamp(200px,34vw,340px)] h-auto block drop-shadow-[0_0_18px_rgba(109,59,255,0.35)]"
          alt=""
          src="/websk-signature.png"
          style={{ opacity: 0 }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Tagline */}
        <div className="tag mt-[clamp(18px,3vh,30px)] min-h-[4.4em] text-[clamp(16px,2.1vw,21px)] leading-relaxed tracking-[0.01em] font-serif text-white">
          <span className="block translate-y-2 text-[#9ea2c0]" style={{ opacity: 0 }}>Web experiences</span>
          <span className="block translate-y-2 text-[#9ea2c0]" style={{ opacity: 0 }}>shaped by code, not templates.</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sig {
          -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 58%);
          mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 58%);
          -webkit-mask-size: 260% 100%; mask-size: 260% 100%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: 100% 0; mask-position: 100% 0;
          animation: write 1.2s cubic-bezier(.45,.05,.3,1) 0.1s forwards;
        }
        @keyframes write { 
          0% { opacity: 0; -webkit-mask-position: 100% 0; mask-position: 100% 0; }
          1% { opacity: 1; -webkit-mask-position: 100% 0; mask-position: 100% 0; }
          100% { opacity: 1; -webkit-mask-position: 0 0; mask-position: 0 0; } 
        }

        .tag span {
          display: inline-block;
        }
        .tag span:nth-child(1) { animation: up 0.6s ease 0.6s forwards; }
        .tag span:nth-child(2) { animation: up 0.6s ease 0.9s forwards; }
        @keyframes up { 
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: none; } 
        }
      `}} />
    </div>
  );
}
