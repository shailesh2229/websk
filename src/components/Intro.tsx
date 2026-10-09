"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-serif",
});

export function Intro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sigRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // If reduced motion is preferred, skip intro immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      return;
    }

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Initial hero states
    gsap.set("#navbar", { opacity: 0, y: -14 });
    gsap.set(".hero-word", { yPercent: 115 });
    gsap.set(".hero-dash", { scaleX: 0, transformOrigin: "left" });
    gsap.set(".hero-pill", { xPercent: -110 });
    gsap.set(".hero-role", { opacity: 0, y: 24 });
    gsap.set("#page-shell", { y: 60 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsDone(true);
      },
    });

    // Path logic
    const st = { y: 115, c: 15, mode: "enter" };

    const updatePath = () => {
      if (!pathRef.current) return;
      let d = "";
      if (st.mode === "enter") {
        d = `M0,100 L0,${st.y} Q50,${st.y - 2 * st.c} 100,${st.y} L100,100 Z`;
      } else {
        d = `M0,0 L100,0 L100,${st.y} Q50,${st.y - 2 * st.c} 0,${st.y} Z`;
      }
      pathRef.current.setAttribute("d", d);
    };

    // 1. Enter: Tween st.y 115 -> 0
    tl.to(
      st,
      {
        y: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onUpdate: updatePath,
      },
      0.05,
    );

    // 2. Call: switch mode, reset y, ensure path covers everything
    tl.call(() => {
      st.mode = "exit";
      st.y = 115;
      updatePath(); // Instantly update so screen remains dark
      if (containerRef.current)
        containerRef.current.style.background = "transparent";
    });

    // 3. Signature wipe: --p 0 -> 114
    tl.to(sigRef.current, {
      "--p": 114,
      duration: 0.8,
      ease: "power1.inOut",
    });

    // 4. Tagline lines stagger
    tl.fromTo(
      [line1Ref.current, line2Ref.current],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.16 },
      "-=0.35",
    );

    // 5. Hold, then fade out signature + tagline
    tl.to([sigRef.current, line1Ref.current, line2Ref.current], {
      opacity: 0,
      y: -10,
      duration: 0.22,
      ease: "power2.in",
      delay: 0.3,
    });

    // 6. Exit: st.y 115 -> 0, page-shell y 60 -> 0
    const exitTime = tl.duration();

    tl.to(
      st,
      {
        y: 0,
        duration: 0.7,
        ease: "power3.inOut",
        onUpdate: updatePath,
      },
      exitTime,
    );

    tl.to(
      "#page-shell",
      {
        y: 0,
        duration: 0.7,
        ease: "power3.inOut",
      },
      exitTime,
    );

    // 7. Hero entrance overlapping end of exit
    const heroTime = exitTime + 0.3; // overlapping end of step 6

    tl.to("#navbar", { opacity: 1, y: 0, duration: 0.5 }, heroTime);
    tl.to(
      ".hero-word",
      { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.06 },
      heroTime,
    );
    tl.to(".hero-dash", { scaleX: 1, duration: 0.5 }, heroTime + 0.2);
    tl.to(
      ".hero-pill",
      { xPercent: 0, duration: 0.7, ease: "power3.out" },
      heroTime + 0.1,
    );
    tl.to(".hero-role", { opacity: 1, y: 0, duration: 0.6 }, heroTime + 0.3);

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-[#141414] ${sourceSerif.variable}`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-10"
      >
        <path ref={pathRef} fill="#141414" d="M0,0 L100,0 L100,100 L0,100 Z" />
      </svg>

      <div className="relative z-20 flex flex-col items-center justify-center gap-6">
        <div
          ref={sigRef}
          style={
            {
              "--p": 0,
              WebkitMaskImage:
                "linear-gradient(90deg, #000 calc(var(--p) * 1% - 14%), transparent calc(var(--p) * 1%))",
              maskImage:
                "linear-gradient(90deg, #000 calc(var(--p) * 1% - 14%), transparent calc(var(--p) * 1%))",
            } as React.CSSProperties
          }
          className="w-[clamp(260px,40vw,620px)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/websk-signature-nav.png"
            alt="Websk"
            className="w-full h-auto"
          />
        </div>

        <div
          className="text-[#9d9dba] text-[clamp(17px,1.7vw,24px)] leading-[1.5] text-center flex flex-col items-center"
          style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
        >
          <div ref={line1Ref} className="opacity-0">
            Web experiences
          </div>
          <div ref={line2Ref} className="opacity-0">
            shaped by code, not templates.
          </div>
        </div>
      </div>
    </div>
  );
}
