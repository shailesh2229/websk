"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Code2, Palette, Sparkles, Smartphone } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  {
    n: "01",
    title: "WEB DEVELOPMENT",
    desc: "Building modern, responsive and interactive websites.",
    icon: Code2,
  },
  {
    n: "02",
    title: "UI / UX DESIGN",
    desc: "Designing clean, intuitive and visually engaging digital experiences.",
    icon: Palette,
  },
  {
    n: "03",
    title: "CREATIVE DEVELOPMENT",
    desc: "Creating interactive websites with animations, motion and immersive experiences.",
    icon: Sparkles,
  },
  {
    n: "04",
    title: "RESPONSIVE EXPERIENCES",
    desc: "Making websites work beautifully across desktop, tablet and mobile.",
    icon: Smartphone,
  },
];

export function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.service-card');
      const heading = headingRef.current;
      if (!cards.length) return;

      const isMobile = window.innerWidth < 768;
      const Z_START = isMobile ? -200 : -500;
      const Y_START = isMobile ? "50vh" : "70vh";
      const ROT_X_START = isMobile ? 10 : 25;

      // Set initial states for cards
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: Y_START,
          z: Z_START,
          rotationX: ROT_X_START,
          rotationZ: isMobile ? 0 : (i % 2 === 0 ? -4 : 4),
          scale: 0.6,
          opacity: 0,
          zIndex: i + 1,
          transformOrigin: "center center",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // Smooth interpolation
        }
      });

      const DURATION = 1;
      const PAUSE = 0.6;

      cards.forEach((card, i) => {
        const stepTl = gsap.timeline();

        // Card enters to ACTIVE (center) position
        stepTl.to(card, {
          y: 0,
          z: 0,
          rotationX: 0,
          rotationZ: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          duration: DURATION,
        }, 0);

        // Subtly animate the heading when the first card comes in
        if (i === 0 && heading) {
          stepTl.to(heading, {
            y: isMobile ? -10 : -30,
            scale: 0.95,
            opacity: 0.6,
            ease: "power2.out",
            duration: DURATION,
          }, 0);
        }

        // PREVIOUS cards move BACK into the stack
        for (let j = 0; j < i; j++) {
          const depth = i - j; // 1 = just behind, 2 = further behind
          stepTl.to(cards[j], {
            y: isMobile ? -(depth * 40) : -(depth * 70), // Move up
            z: isMobile ? -(depth * 80) : -(depth * 150), // Move back in 3D
            rotationX: isMobile ? -(depth * 2) : -(depth * 6), // Tilt back
            scale: 1 - (depth * 0.07),
            opacity: Math.max(0.1, 1 - (depth * 0.35)),
            ease: "power2.out",
            duration: DURATION,
          }, 0);
        }

        // Add this sequence to the main timeline
        tl.add(stepTl, i === 0 ? 0 : `+=${PAUSE}`);
      });

      // Pause at the end for the final card to be readable before unpinning
      tl.to({}, { duration: PAUSE * 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-black text-white" 
      style={{ height: `${(SERVICES.length + 1.5) * 100}vh` }}
    >
      
      {/* 
        Single sticky container for both background and content 
        This fixes the 100vh gap issue where two siblings were pushed apart in document flow
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Background Cosmic Effects */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[#020205]">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/15 blur-[120px] mix-blend-screen opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/15 blur-[140px] mix-blend-screen opacity-70" />
          <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px] mix-blend-screen" />
          
          {/* Subtle CSS Stars/Noise */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{ 
              backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 140px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 200px 190px, #ffffff, rgba(0,0,0,0))', 
              backgroundSize: '250px 250px' 
            }} 
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-20 perspective-[1200px]">
          
          <div ref={headingRef} className="absolute top-[10vh] md:top-[12vh] left-0 w-full text-center px-6 z-0 will-change-transform">
            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white/40 mb-4">SERVICES</p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              WHAT WE DO
            </h2>
          </div>

          <div ref={trackRef} className="relative w-full max-w-[900px] h-[65vh] md:h-[550px] flex items-center justify-center px-4 mt-16 md:mt-24 transform-style-3d">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.n}
                  className="service-card absolute w-[92vw] max-w-[750px] aspect-[4/5] md:aspect-[16/10] max-h-[500px] flex flex-col justify-between p-8 md:p-12 rounded-3xl overflow-hidden will-change-transform shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "inset 0 0 40px rgba(255,255,255,0.02), 0 30px 80px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none mix-blend-overlay" />
                  
                  <div className="relative z-10 flex justify-between items-start mb-auto">
                    <span className="font-mono text-5xl md:text-7xl font-bold tracking-tighter text-white/10 mix-blend-overlay tabular-nums">
                      {s.n}
                    </span>
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-200/90" strokeWidth={1.2} />
                    </div>
                  </div>

                  <div className="relative z-10 mt-12 md:mt-auto">
                    <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 tracking-wide drop-shadow-md">
                      {s.title}
                    </h3>
                    <p className="text-base md:text-lg lg:text-xl leading-relaxed text-white/60 max-w-xl font-sans font-light">
                      {s.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
