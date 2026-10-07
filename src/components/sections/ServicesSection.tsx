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
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [sectionH, setSectionH] = useState<number | undefined>();

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vw = 0, vh = 0, trackW = 0;
    let current = 0, first = true;
    let raf = 0, visible = false;
    const pointer = { x: -9999, y: -9999 };
    let touchTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      trackW = track.scrollWidth;
      setSectionH(vh + trackW);
    };

    const tick = () => {
      const top = section.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / trackW));
      const target = vw - p * trackW;
      if (first) { current = target; first = false; }
      current += (target - current) * (reduce ? 1 : 0.12);
      if (Math.abs(target - current) < 0.05) current = target;
      track.style.transform = `translate3d(${current}px,0,0)`;

      for (const c of cards) {
        const r = c.getBoundingClientRect();
        const hit =
          pointer.x >= r.left && pointer.x <= r.right &&
          pointer.y >= r.top && pointer.y <= r.bottom;
        if (hit) {
          c.style.setProperty("--mx", `${pointer.x - r.left}px`);
          c.style.setProperty("--my", `${pointer.y - r.top}px`);
        }
        const v = hit ? "true" : "false";
        if (c.dataset.active !== v) c.dataset.active = v;
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; if (visible) start(); },
      { rootMargin: "100px 0px" }
    );
    io.observe(section);

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      if (touchTimer) clearTimeout(touchTimer);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        touchTimer = setTimeout(() => { pointer.x = -9999; pointer.y = -9999; }, 700);
      }
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    const onResize = () => { measure(); start(); };

    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (touchTimer) clearTimeout(touchTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="services" ref={sectionRef} style={{ height: sectionH }} className="relative">
      <style>{`
        .svc-card{position:relative;overflow:hidden;border-radius:1.5rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);user-select:none;-webkit-user-select:none;transition:border-color .4s,transform .5s cubic-bezier(.22,1,.36,1)}
        .svc-card::before{content:"";position:absolute;inset:0;opacity:0;transition:opacity .45s ease;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),#ff8a1f 0%,#f04a00 38%,#c81e00 100%)}
        .svc-card[data-active="true"]{border-color:transparent;transform:translateY(-6px)}
        .svc-card[data-active="true"]::before{opacity:1}
        .svc-desc{color:rgba(255,255,255,.5);transition:color .4s}
        .svc-card[data-active="true"] .svc-desc{color:rgba(255,255,255,.92)}
        .svc-icon{display:grid;place-items:center;width:2rem;height:2rem;border-radius:9999px;border:1px solid rgba(255,255,255,.25);color:#fff;font-size:.8rem;transition:background .4s,color .4s}
        .svc-card[data-active="true"] .svc-icon{background:#fff;color:#000}
      `}</style>

      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mb-10 px-[8vw]">
          <p className="mb-3 text-xs tracking-[0.3em] text-white/40">SERVICES</p>
          <h2 className="font-serif text-5xl font-bold text-white md:text-6xl">What We Do</h2>
        </div>

        <div ref={trackRef} className="flex w-max gap-6 pr-[8vw] will-change-transform">
          {SERVICES.map((s, i) => (
            <article
              key={s.n}
              ref={(el) => { cardRefs.current[i] = el; }}
              data-active="false"
              className="svc-card aspect-[4/5] w-[78vw] shrink-0 md:aspect-square md:w-[24vw]"
            >
              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <span className="absolute left-8 top-6 text-xs text-white/50">{s.n}</span>
                <span className="svc-icon absolute right-8 top-6">↗</span>
                <h3 className="mb-3 font-serif text-2xl text-white md:text-3xl">{s.title}</h3>
                <p className="svc-desc text-sm leading-relaxed">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
