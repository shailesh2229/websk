"use client";

import { useEffect, useRef, useState } from "react";

const SERVICES = [
  { n: "01", title: "Website Design", desc: "Clean, modern, responsive layouts tailored to your brand with intentional typography and spacing." },
  { n: "02", title: "Website Development", desc: "Hand-crafted front-end development with performance, accessibility, and scalability in mind." },
  { n: "05", title: "UI/UX Design", desc: "User-centered design that balances aesthetics with clarity, usability, and business goals." },
  { n: "06", title: "Website Redesign", desc: "Transform outdated websites into modern, high-performing digital experiences." },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    let raf = 0;

    const measure = () => {
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      setHeight(window.innerHeight + extra);
    };

    const update = () => {
      raf = 0;
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      const top = section.getBoundingClientRect().top;
      const p = extra ? Math.min(1, Math.max(0, -top / extra)) : 0;
      track.style.transform = `translate3d(${-p * extra}px,0,0)`;

      const mid = window.innerWidth / 2;
      let best = 0, bestDist = Infinity;
      Array.from(track.children).forEach((c, i) => {
        const r = (c as HTMLElement).getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="services" ref={sectionRef} style={{ height }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-[8vw] mb-10">
          <p className="text-xs tracking-[0.3em] text-white/40 mb-3">SERVICES</p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white">What We Do</h2>
        </div>
        <div ref={trackRef} className="flex gap-6 px-[8vw] will-change-transform">
          {SERVICES.map((s, i) => (
            <article
              key={s.n}
              className={`relative shrink-0 w-[78vw] md:w-[26vw] aspect-[4/5] md:aspect-square rounded-3xl p-8 flex flex-col justify-end border transition-all duration-500 ${
                i === active
                  ? "bg-gradient-to-br from-orange-500 to-red-600 border-transparent scale-[1.03]"
                  : "bg-white/[0.04] border-white/10"
              }`}
            >
              <span className="absolute top-6 left-8 text-xs text-white/50">{s.n}</span>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">{s.title}</h3>
              <p className={`text-sm leading-relaxed ${i === active ? "text-white/90" : "text-white/50"}`}>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
