"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

let hasPlayed = false;

interface SignatureIntroProps {
  onComplete?: () => void;
}

const msgs: [number, string][] = [
  [0, "Setting up the canvas"],
  [28, "Writing clean code"],
  [55, "Tuning performance"],
  [80, "Polishing the details"],
  [96, "Ready"],
];

export function SignatureIntro({ onComplete }: SignatureIntroProps) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [phase, setPhase] = useState<"play" | "done" | "unmount">("play");
  const [loadingPct, setLoadingPct] = useState("00");
  const [statusText, setStatusText] = useState("Setting up the canvas");
  const [statusSwap, setStatusSwap] = useState(false);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const forcePlay = window.location.search.includes("loader=1");
    if (hasPlayed && !forcePlay) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPreloader(false);
       
      setPhase("unmount");
      delete document.documentElement.dataset.loader;
      window.dispatchEvent(new Event("introComplete"));
      if (onComplete) onComplete();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce && !forcePlay) {
       
      setShowPreloader(false);
       
      setPhase("unmount");
      hasPlayed = true;
      delete document.documentElement.dataset.loader;
      window.dispatchEvent(new Event("introComplete"));
      if (onComplete) onComplete();
      return;
    }

    document.body.style.overflow = "hidden";

    const DUR = 4600;
    const DELAY = 900;
    let t0 = 0;
    let raf = 0;
    let curMsgIndex = 0;

    function ease(x: number) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    function tick(now: number) {
      if (!t0) t0 = now;
      const p = Math.min(Math.max((now - t0 - DELAY) / DUR, 0), 1);
      const e = ease(p);
      const n = Math.round(e * 100);

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${e})`;
      }
      setLoadingPct(String(n).padStart(2, "0"));

      let nextIndex = curMsgIndex;
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (n >= msgs[i][0]) {
          nextIndex = i;
          break;
        }
      }

      if (nextIndex !== curMsgIndex) {
        setStatusSwap(true);
        setTimeout(() => {
          setStatusText(msgs[nextIndex][1]);
          setStatusSwap(false);
        }, 220);
        curMsgIndex = nextIndex;
      }

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setPhase("done");
          delete document.documentElement.dataset.loader;
          setTimeout(() => {
            setPhase("unmount");
            setShowPreloader(false);
            document.body.style.overflow = "";
            hasPlayed = true;
            window.dispatchEvent(new Event("introComplete"));
            if (onComplete) onComplete();
          }, 1000); // Wait for slide up
        }, 500);
      }
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (phase === "unmount" || !showPreloader) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: phase === "done" ? "-100%" : 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent text-white overflow-hidden font-serif"
        >
          <div className="relative z-10 flex flex-col items-center w-[min(92vw,520px)] text-center">
            {/* Signature */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="sig w-[clamp(200px,34vw,340px)] h-auto block drop-shadow-[0_0_18px_rgba(109,59,255,0.35)]"
              alt=""
              src="/websk-signature.png"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Tagline */}
            <div className="tag mt-[clamp(18px,3vh,30px)] min-h-[4.4em] text-[clamp(16px,2.1vw,21px)] leading-relaxed tracking-[0.01em]">
              <span className="block opacity-0 translate-y-2 text-[#9ea2c0]">Web experiences</span>
              <span className="block opacity-0 translate-y-2 text-[#9ea2c0]">shaped by code, not templates.</span>
            </div>

            {/* Progress Bar */}
            <div className="bar mt-[clamp(18px,3vh,30px)] w-[min(220px,50vw)] h-[1px] bg-[#22254a] relative overflow-hidden opacity-0">
              <div
                ref={fillRef}
                className="absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#c9c6ff_70%,#fff)]"
              />
            </div>

            {/* Meta */}
            <div className="meta mt-[14px] font-mono text-[10px] tracking-[0.28em] uppercase text-[#6a6e90] opacity-0">
              Loading {loadingPct}%
            </div>

            {/* Status */}
            <div
              className={`status mt-[18px] font-mono text-[9.5px] tracking-[0.3em] uppercase text-[#6a6e90] opacity-0 h-[1.2em] transition-opacity duration-200 ${
                statusSwap ? "!opacity-25" : ""
              }`}
            >
              {statusText}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            .sig {
              -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 58%);
              mask-image: linear-gradient(90deg, #000 0%, #000 42%, transparent 58%);
              -webkit-mask-size: 260% 100%; mask-size: 260% 100%;
              -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
              -webkit-mask-position: 100% 0; mask-position: 100% 0;
              animation: write 1.9s cubic-bezier(.45,.05,.3,1) .15s forwards;
            }
            @keyframes write { to { -webkit-mask-position: 0 0; mask-position: 0 0; } }

            .tag span:nth-child(1) { animation: up .9s ease 1.6s forwards; }
            .tag span:nth-child(2) { animation: up .9s ease 2.3s forwards; }
            @keyframes up { to { opacity: 1; transform: none; } }

            .bar { animation: fade .6s ease .9s forwards; }
            .meta { animation: fade .6s ease 1s forwards; }
            .status { animation: fade .6s ease 1s forwards; }
            @keyframes fade { to { opacity: 1; } }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
