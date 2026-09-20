"use client";

import Link from "next/link";
import { LayoutTemplate, Code2, Palette, RefreshCw, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Website Design",
    description: "Clean, modern, responsive layouts tailored to your brand with intentional typography and spacing.",
    fill: "#0a0a0a",
    startRot: -6,
    endRot: 0,
  },
  {
    number: "02",
    icon: Code2,
    title: "Website Development",
    description: "Hand-crafted front-end development with performance, accessibility, and scalability in mind.",
    fill: "#101010",
    startRot: 4,
    endRot: -2,
  },
  {
    number: "05",
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that balances aesthetics with clarity, usability, and business goals.",
    fill: "#161616",
    startRot: -3,
    endRot: 2,
  },
  {
    number: "06",
    icon: RefreshCw,
    title: "Website Redesign",
    description: "Transform outdated websites into modern, high-performing digital experiences.",
    fill: "#1c1c1c",
    startRot: 5,
    endRot: -1.5,
  }
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // In real multi-page routing mode, the scroller is the window
      const scroller = window;
      
      const cards = gsap.utils.toArray<HTMLElement>('.stack-item');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".stack-trigger",
          scroller: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        }
      });

      cards.forEach((card, index) => {
        // Initial setup
        const service = services[index];
        const startRot = isMobile ? gsap.utils.clamp(-3, 3, service.startRot) : service.startRot;
        const endRot = isMobile ? gsap.utils.clamp(-3, 3, service.endRot) : service.endRot;

        gsap.set(card, {
          scale: 0.55,
          rotation: startRot,
          width: isMobile ? "70%" : "45%",
          transformOrigin: "center center",
          yPercent: index === 0 ? 0 : 110,
          zIndex: index + 1,
        });

        // The animation step for THIS card entering
        const stepTl = gsap.timeline();
        
        // It flies in and straightens out
        stepTl.to(card, {
          yPercent: 0,
          scale: 1,
          rotation: endRot,
          width: "100%", // max-width is controlled by CSS class `max-w-[1100px]`
          ease: "back.out(1.4)",
          duration: 1,
        }, 0);

        // Previous cards get pushed down/dimmed
        for (let i = 0; i < index; i++) {
          const depth = index - i;
          stepTl.to(cards[i], {
            scale: 1 - (depth * 0.04), // 0.96, 0.92, etc
            y: -24 * depth,
            ease: "power3.inOut",
            duration: 1,
          }, 0);
          
          // Animate the dimming overlay inside the card
          const overlay = cards[i].querySelector('.dim-overlay');
          if (overlay) {
            stepTl.to(overlay, {
              opacity: depth * 0.2, // 0.2, 0.4 etc
              ease: "power3.inOut",
              duration: 1,
            }, 0);
          }
        }

        // Add this card's entrance to the main timeline
        // Card 0 is already in center (just scales up), others come in sequentially
        if (index === 0) {
          tl.add(stepTl, 0);
        } else {
          tl.add(stepTl, `+=${0.5}`); // space out the scrub
        }
      });
      
      // We must call refresh so it calculates start/end correctly against the absolute scroller
      ScrollTrigger.refresh();

    }, containerRef);

    return () => ctx.revert();
  }, [reduceMotion, isMobile]);

  if (reduceMotion) {
    return (
      <section className="bg-transparent py-24 md:py-32 w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">Services</span>
            <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white uppercase font-sans">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="w-full flex flex-col justify-between border border-[#2a2a2a] rounded-[32px] p-[28px] md:p-[48px]" style={{ backgroundColor: service.fill }}>
                  <div className="flex justify-between items-start mb-16 md:mb-24">
                    <span className="font-mono text-sm tracking-widest text-[#8a8a8a] tabular-nums pt-1">{service.number}</span>
                    <Icon className="w-9 h-9 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight text-white font-sans">{service.title}</h3>
                    <p className="text-[18px] md:text-[20px] leading-[1.6] text-[#8a8a8a] max-w-md font-sans mb-8 md:mb-12">{service.description}</p>
                    <ArrowUpRight className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="bg-transparent w-full relative">
      <div className="mb-8 pt-[108px] flex flex-col items-center text-center">
        <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">
          Services
        </span>
        <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white uppercase font-sans">
          What We Do
        </h2>
      </div>

      {/* The scrollable height container (4 cards = roughly 400vh) */}
      <div className="stack-trigger w-full relative" style={{ height: "400vh" }}>
        {/* The sticky stage where cards are positioned absolutely */}
        <div 
          className="stack-stage sticky flex items-center justify-center overflow-hidden" 
          style={{ 
            top: "calc(84px + 24px)", // below navbar
            height: "calc(100vh - 84px - 48px)" // visible stage height
          }}
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx} 
                className="stack-item absolute max-w-[1100px] w-full flex flex-col justify-between border border-[#2a2a2a] rounded-[32px] p-[28px] md:p-[48px] shadow-2xl overflow-hidden"
                style={{ backgroundColor: service.fill, height: "60vh", minHeight: "400px" }}
              >
                {/* Dimming overlay for GSAP (replaces CSS filter) */}
                <div className="dim-overlay absolute inset-0 bg-black pointer-events-none" style={{ opacity: 0, zIndex: 10 }} />
                
                <div className="flex justify-between items-start mb-auto relative z-20">
                  <span className="font-mono text-sm tracking-widest text-[#8a8a8a] tabular-nums pt-1">
                    {service.number}
                  </span>
                  <Icon className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                
                <div className="flex flex-col gap-4 mt-auto relative z-20">
                  <h3 className="text-[24px] md:text-[36px] font-bold tracking-tight text-white font-sans">
                    {service.title}
                  </h3>
                  <p className="text-[16px] md:text-[20px] leading-[1.6] text-[#8a8a8a] max-w-lg font-sans mb-6">
                    {service.description}
                  </p>
                  <Link href="/services" className="inline-flex">
                    <ArrowUpRight className="w-6 h-6 text-white hover:translate-x-1 hover:-translate-y-1 transition-transform" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
