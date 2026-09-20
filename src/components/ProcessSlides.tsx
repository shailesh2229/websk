"use client";

import { useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const SLIDES = [
  { i: 0, kind: "intro" as const },
  {
    i: 1,
    kind: "step" as const,
    num: "01",
    title: "Discover",
    lead: "We dig into your business, audience, and goals before anything is designed.",
    bullets: [
      "We learn how your business really works",
      "What you need, not what a template gives",
      "A clear brief before any design starts",
    ],
  },
  {
    i: 2,
    kind: "step" as const,
    num: "02",
    title: "Define",
    lead: "Strategy, structure, and visual direction locked in with clear priorities.",
    bullets: [
      "Site map, pages and content plan",
      "Visual direction and style agreed",
      "Scope, timeline and priorities in writing",
    ],
  },
  {
    i: 3,
    kind: "step" as const,
    num: "03",
    title: "Build",
    lead: "Design and development come together into one polished experience.",
    bullets: [
      "Custom design and clean code, one team",
      "Fast, responsive, SEO-ready pages",
      "Regular previews so nothing surprises you",
    ],
  },
  {
    i: 4,
    kind: "step" as const,
    num: "04",
    title: "Launch",
    lead: "Rigorous testing, fine-tuning, and a confident go-live.",
    bullets: [
      "Tested on every device and browser",
      "Speed and small details fine-tuned",
      "Live with support after launch",
    ],
  },
];

const N = 5; // number of slides (intro + 4)

const TINTS = [
  [109, 59, 255, 0.12],
  [59, 43, 224, 0.16],
  [139, 92, 246, 0.15],
  [80, 60, 255, 0.15],
  [109, 59, 255, 0.18],
];
const TINTS2 = [
  [59, 43, 224, 0.1],
  [109, 59, 255, 0.12],
  [59, 43, 224, 0.14],
  [139, 92, 246, 0.12],
  [59, 43, 224, 0.16],
];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function mixColor(arr: number[][], p: number): string {
  const i = clamp(Math.floor(p), 0, arr.length - 2);
  const t = p - i;
  const a = arr[i];
  const b = arr[i + 1];
  return `rgba(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)},${(a[3] + (b[3] - a[3]) * t).toFixed(3)})`;
}

// ─── Fallback: vertical list (prefers-reduced-motion) ────────────────────────
function VerticalList() {
  const steps = SLIDES.slice(1);
  return (
    <section className="w-full py-24 md:py-32" aria-label="How we work">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 text-center">
          <span className="text-[10px] font-mono tracking-[0.32em] uppercase text-[#6a6e90] mb-4 block">[ Process ]</span>
          <h2 className="text-[clamp(40px,8vw,112px)] font-bold tracking-[-0.035em] leading-[0.95] text-[#f1f1f8] font-[family-name:var(--font-ibm-plex)]">
            How we work<span style={{ color: "#6D3BFF", textShadow: "0 0 28px rgba(109,59,255,.65)" }}>.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-12">
          {steps.map((s) => (
            <div key={s.i} className="border-t border-[#2a2d55] pt-8">
              <div className="flex gap-8">
                <span className="font-mono text-sm tracking-widest text-[#6a6e90] pt-1 shrink-0">{s.num}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-white font-[family-name:var(--font-ibm-plex)] mb-3">
                    {s.title}<span style={{ color: "#6D3BFF" }}>.</span>
                  </h3>
                  <p className="text-[#c9cade] mb-4 leading-relaxed">{s.lead}</p>
                  <ul className="space-y-2">
                    {s.bullets?.map((b, k) => (
                      <li key={k} className="text-[#9ea2c0] text-sm pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#a99bff]">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProcessSlides() {
  const sectionRef = useRef<HTMLElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linkRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snappingRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const sec = sectionRef.current;
    if (!sec) return;

    let target = 0;
    let cur = 0;

    function readScroll() {
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      target = clamp((-r.top / total) * (N - 1), 0, N - 1);
    }

    function render(p: number) {
      const vw = window.innerWidth;

      slideRefs.current.forEach((s, i) => {
        if (!s) return;
        const d = i - p;
        const a = Math.min(Math.abs(d), 1);
        const x = d * vw * 0.62;
        const sc = 1 - a * 0.07;
        const op = Math.pow(1 - a, 1.3);
        s.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scale(${sc.toFixed(3)})`;
        s.style.opacity = op.toFixed(3);
        s.style.filter = a > 0.02 ? `blur(${(a * 5).toFixed(1)}px)` : "none";
        s.style.visibility = a >= 1 ? "hidden" : "visible";
        const g = ghostRefs.current[i];
        if (g) {
          g.style.transform = `translate3d(${(d * vw * 0.22).toFixed(1)}px,-50%,0)`;
        }
      });

      if (tintRef.current) {
        tintRef.current.style.setProperty("--tint", mixColor(TINTS, p));
        tintRef.current.style.setProperty("--tint2", mixColor(TINTS2, p));
      }

      const stepperOpacity = clamp((p - 0.35) / 0.5, 0, 1).toFixed(2);
      if (stepperRef.current) stepperRef.current.style.opacity = stepperOpacity;
      if (countRef.current) countRef.current.style.opacity = stepperOpacity;

      const active = Math.round(p);
      nodeRefs.current.forEach((n, k) => {
        if (!n) return;
        const step = k + 1;
        n.dataset.active = active === step ? "true" : "false";
        n.dataset.done = active > step ? "true" : "false";
      });
      linkRefs.current.forEach((l, k) => {
        if (!l) return;
        (l as HTMLElement).style.transform = `scaleX(${clamp(p - (k + 1), 0, 1).toFixed(3)})`;
      });
      if (countRef.current) {
        countRef.current.textContent = `${active > 0 ? String(active).padStart(2, "0") : "00"} / 04`;
      }
    }

    function loop() {
      cur = reduce ? target : cur + (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      render(cur);
      rafRef.current = requestAnimationFrame(loop);
    }

    function softSnap() {
      if (!sec || snappingRef.current) return;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const y = -r.top;
      if (y <= 2 || y >= total - 2) return;
      const idx = Math.round(clamp(y / total, 0, 1) * (N - 1));
      const snapTop = window.scrollY + r.top + (idx / (N - 1)) * total;
      if (Math.abs(window.scrollY - snapTop) > 4) {
        snappingRef.current = true;
        window.scrollTo({ top: snapTop, behavior: "smooth" });
        setTimeout(() => { snappingRef.current = false; }, 700);
      }
    }

    function onScroll() {
      readScroll();
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(softSnap, 220);
    }

    function onResize() { readScroll(); }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    readScroll();
    cur = target;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  // Prefers-reduced-motion: render vertical list
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return <VerticalList />;
  }

  return (
    <>
      {/* SSR-safe reduced motion: show vertical list when CSS media query applies */}
      <noscript><VerticalList /></noscript>

      <section
        ref={sectionRef}
        className="process-section relative z-10"
        style={{ height: "500vh" }}
        aria-label="How we work"
      >
        {/* Sticky viewport container */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100dvh",
            overflow: "hidden",
          }}
        >
          {/* Tint overlay — uses CSS custom properties set by JS */}
          <div
            ref={tintRef}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(60% 55% at 28% 45%, var(--tint, rgba(109,59,255,.12)), transparent 70%), radial-gradient(50% 45% at 85% 80%, var(--tint2, rgba(59,43,224,.10)), transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* ── Slides ── */}
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.i}
              ref={(el) => { slideRefs.current[idx] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: "84px 8vw 130px",
                willChange: "transform, opacity",
                justifyContent: slide.kind === "intro" ? "center" : undefined,
                textAlign: slide.kind === "intro" ? "center" : undefined,
              }}
            >
              {/* Ghost number (parallax) */}
              {slide.kind === "step" && (
                <div
                  ref={(el) => { ghostRefs.current[idx] = el; }}
                  style={{
                    position: "absolute",
                    right: "5vw",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-ibm-plex, monospace)",
                    fontWeight: 700,
                    fontSize: "clamp(170px, 32vw, 500px)",
                    lineHeight: 1,
                    letterSpacing: "-0.06em",
                    color: "rgba(255,255,255,0.045)",
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  {slide.num}
                </div>
              )}

              {/* Content */}
              <div style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: slide.kind === "intro" ? "0 auto" : undefined }}>
                {slide.kind === "intro" ? (
                  <>
                    <div style={{
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "#6a6e90",
                      marginBottom: 22,
                      fontFamily: "var(--font-ibm-plex, monospace)",
                    }}>
                      [ Process ]
                    </div>
                    <h2 style={{
                      fontFamily: "var(--font-ibm-plex, monospace)",
                      fontWeight: 700,
                      fontSize: "clamp(40px, 8vw, 112px)",
                      letterSpacing: "-0.035em",
                      lineHeight: 0.95,
                      color: "#f1f1f8",
                    }}>
                      How we work<span style={{ color: "#6D3BFF", textShadow: "0 0 28px rgba(109,59,255,.65)" }}>.</span>
                    </h2>
                    <p style={{
                      marginTop: 26,
                      fontSize: "clamp(14px, 1.35vw, 19px)",
                      lineHeight: 1.7,
                      color: "#c9cade",
                      maxWidth: 560,
                      marginLeft: "auto",
                      marginRight: "auto",
                      fontFamily: "var(--font-ibm-plex, monospace)",
                    }}>
                      Four clear steps from first conversation to launch — focused on clarity, speed, and results.
                    </p>
                    <div style={{
                      marginTop: 34,
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#6a6e90",
                      fontFamily: "var(--font-ibm-plex, monospace)",
                    }}>
                      Discover · Define · Build · <span style={{ fontWeight: 500, color: "#a99bff" }}>Launch</span>
                    </div>
                    <div style={{
                      position: "absolute",
                      left: 0, right: 0,
                      bottom: "calc(-100px + 6vh)",
                      textAlign: "center",
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#6a6e90",
                      fontFamily: "var(--font-ibm-plex, monospace)",
                    }}>
                      <span className="process-cue-nudge">Scroll to begin ↓</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 style={{
                      fontFamily: "var(--font-ibm-plex, monospace)",
                      fontWeight: 700,
                      fontSize: "clamp(44px, 9vw, 132px)",
                      letterSpacing: "-0.035em",
                      lineHeight: 0.95,
                      color: "#f1f1f8",
                    }}>
                      {slide.title}<span style={{ color: "#6D3BFF", textShadow: "0 0 28px rgba(109,59,255,.65)" }}>.</span>
                    </h2>
                    <p style={{
                      marginTop: 26,
                      fontSize: "clamp(14px, 1.35vw, 19px)",
                      lineHeight: 1.7,
                      color: "#c9cade",
                      maxWidth: 560,
                      fontFamily: "var(--font-ibm-plex, monospace)",
                    }}>
                      {slide.lead}
                    </p>
                    <ul style={{ listStyle: "none", marginTop: 22, display: "grid", gap: 11, maxWidth: 560 }}>
                      {slide.bullets?.map((b, k) => (
                        <li key={k} style={{
                          fontSize: "clamp(12px, 1.05vw, 15px)",
                          lineHeight: 1.6,
                          color: "#9ea2c0",
                          paddingLeft: 26,
                          position: "relative",
                          fontFamily: "var(--font-ibm-plex, monospace)",
                        }}>
                          <span style={{ position: "absolute", left: 0, color: "#a99bff" }}>—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* ── Counter ── */}
          <div
            ref={countRef}
            style={{
              position: "absolute",
              right: "clamp(16px, 3vw, 44px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              fontSize: 10,
              letterSpacing: "0.24em",
              color: "#6a6e90",
              writingMode: "vertical-rl",
              opacity: 0,
              fontFamily: "var(--font-ibm-plex, monospace)",
            }}
          >
            00 / 04
          </div>

          {/* ── Stepper ── */}
          <div
            ref={stepperRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "calc(5.5vh + env(safe-area-inset-bottom, 0px))",
              zIndex: 5,
              display: "flex",
              alignItems: "flex-start",
              opacity: 0,
              fontFamily: "var(--font-ibm-plex, monospace)",
            }}
          >
            {["D", "D", "B", "L"].map((letter, k) => {
              const labels = ["DISCOVER", "DEFINE", "BUILD", "LAUNCH"];
              return (
                <div key={k} style={{ display: "flex", alignItems: "flex-start" }}>
                  {/* Node */}
                  <div
                    ref={(el) => { nodeRefs.current[k] = el; }}
                    data-active="false"
                    data-done="false"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 64 }}
                    className="process-node"
                  >
                    <span className="process-node-ltr" style={{ fontWeight: 700, fontSize: 15, color: "#6a6e90", transition: "color .3s, text-shadow .3s" }}>
                      {letter}
                    </span>
                    <span className="process-node-lbl" style={{ fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6a6e90", opacity: 0.6, transition: "color .3s, opacity .3s" }}>
                      {labels[k]}
                    </span>
                  </div>
                  {/* Connector line (not after last node) */}
                  {k < 3 && (
                    <div style={{
                      width: "clamp(28px, 7vw, 64px)",
                      height: 1,
                      background: "#2a2d55",
                      marginTop: 10,
                      position: "relative",
                      flexShrink: 0,
                    }}>
                      <span
                        ref={(el) => { linkRefs.current[k] = el; }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "#a99bff",
                          transformOrigin: "left",
                          transform: "scaleX(0)",
                          display: "block",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .process-cue-nudge {
          display: inline-block;
          animation: process-nudge 1.6s ease-in-out infinite;
        }
        @keyframes process-nudge { 50% { transform: translateY(6px); } }
        @media (prefers-reduced-motion: reduce) { .process-cue-nudge { animation: none; } }

        /* Node active/done states driven by data attributes */
        .process-node[data-active="true"] .process-node-ltr {
          color: #a99bff !important;
          text-shadow: 0 0 16px rgba(109,59,255,.9);
        }
        .process-node[data-active="true"] .process-node-lbl {
          color: #a99bff !important;
          opacity: 1 !important;
        }
        .process-node[data-done="true"] .process-node-ltr {
          color: #f1f1f8 !important;
          text-shadow: none;
        }
        .process-node[data-done="true"] .process-node-lbl {
          opacity: 0.8 !important;
        }

        @media (max-width: 640px) {
          .process-section [style*="padding: 84px 8vw"] {
            padding: 84px 24px 140px !important;
          }
        }
      `}</style>
    </>
  );
}
