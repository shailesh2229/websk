"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500"] });

export function IntroCurtain() {
  const panelRef = useRef<HTMLDivElement>(null);
  const sigRef = useRef<HTMLImageElement>(null);
  const t1Ref = useRef<HTMLSpanElement>(null);
  const t2Ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      return;
    }

    const panel = panelRef.current;
    const sig = sigRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    if (!panel || !sig || !t1 || !t2) return;

    let cancelled = false;
    let raf = 0;
    let t0 = 0;

    document.body.style.overflow = "hidden";

    // Hero elements: prepare for staggered entrance
    const navbar = document.getElementById("navbar");
    const words = document.querySelectorAll<HTMLElement>(".hero-word");
    const dash = document.querySelector<HTMLElement>(".hero-dash");
    const pill = document.querySelector<HTMLElement>(".hero-pill");
    const role = document.querySelector<HTMLElement>(".hero-role");
    const shell = document.getElementById("page-shell");

    if (navbar) { navbar.style.opacity = "0"; navbar.style.transform = "translateY(-14px)"; }
    words.forEach((w) => (w.style.transform = "translateY(115%)"));
    if (dash) { dash.style.transform = "scaleX(0)"; dash.style.transformOrigin = "left"; }
    if (pill) { pill.style.transform = "translateX(-110%)"; }
    if (role) { role.style.opacity = "0"; role.style.transform = "translateY(24px)"; }
    if (shell) { shell.style.transform = "translateY(60px)"; }

    const N = 28;
    const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
    const out3 = (t: number) => 1 - Math.pow(1 - t, 3);
    const out4 = (t: number) => 1 - Math.pow(1 - t, 4);

    // Panel already covers the screen from first paint, so there is no "enter" phase.
    const T = {
      write: [0.0, 0.8],
      n1: [0.65, 0.9],
      n2: [0.8, 1.05],
      exit: [1.35, 1.95],
      hero: [1.65, 2.15],
    };

    function shape(top: number, bot: number, c: number) {
      const pts: string[] = [];
      for (let i = 0; i <= N; i++) {
        const x = i / N;
        const s = 1 - Math.pow(2 * x - 1, 2);
        pts.push(x * 100 + "% " + (top - c * s) + "px");
      }
      for (let i = N; i >= 0; i--) {
        const x = i / N;
        const s = 1 - Math.pow(2 * x - 1, 2);
        pts.push(x * 100 + "% " + (bot - c * s) + "px");
      }
      return "polygon(" + pts.join(",") + ")";
    }

    function frame(now: number) {
      if (cancelled) return;
      const t = (now - t0) / 1000;
      const H = window.innerHeight;
      const c = H * 0.13;

      // Panel: top fixed at 0, bottom edge lifts away on exit
      const x = inOut(seg(t, T.exit[0], T.exit[1]));
      const bot = (H + c) * (1 - x);
      const cp = shape(0, bot, c);
      panel!.style.clipPath = cp;
      panel!.style.setProperty("-webkit-clip-path", cp);

      // Signature wipe
      const p = inOut(seg(t, T.write[0], T.write[1])) * 100;
      const maskStr = `linear-gradient(90deg, #000 ${(p * 1.08 - 8).toFixed(2)}%, transparent ${(p * 1.08).toFixed(2)}%)`;
      sig!.style.maskImage = maskStr;
      sig!.style.setProperty("-webkit-mask-image", maskStr);

      // Notes
      const a = out3(seg(t, T.n1[0], T.n1[1]));
      const b = out3(seg(t, T.n2[0], T.n2[1]));
      t1!.style.opacity = String(a);
      t1!.style.transform = `translateY(${8 * (1 - a)}px)`;
      t2!.style.opacity = String(b);
      t2!.style.transform = `translateY(${8 * (1 - b)}px)`;

      // Hero entrance
      if (navbar) {
        const nt = out3(seg(t, T.hero[0], T.hero[0] + 0.5));
        navbar.style.opacity = String(nt);
        navbar.style.transform = `translateY(${-14 * (1 - nt)}px)`;
      }
      words.forEach((w, i) => {
        const wt = seg(t, T.hero[0] + i * 0.06, T.hero[0] + 0.5 + i * 0.06);
        w.style.transform = `translateY(${115 * (1 - out4(wt))}%)`;
      });
      if (dash) {
        const dt = seg(t, T.hero[0] + 0.2, T.hero[0] + 0.6);
        dash.style.transform = `scaleX(${inOut(dt)})`;
      }
      if (pill) {
        const pt = seg(t, T.hero[0], T.hero[1]);
        pill.style.transform = `translateX(${-110 * (1 - out3(pt))}%)`;
      }
      if (role) {
        const rt = out3(seg(t, T.hero[0] + 0.1, T.hero[1]));
        role.style.opacity = String(rt);
        role.style.transform = `translateY(${24 * (1 - rt)}px)`;
      }
      if (shell) {
        const st = seg(t, T.exit[0], T.exit[1]);
        shell.style.transform = `translateY(${60 * (1 - inOut(st))}px)`;
      }

      if (t < T.hero[1] + 0.1) {
        raf = requestAnimationFrame(frame);
      } else {
        document.body.style.overflow = "";
        if (navbar) { navbar.style.opacity = ""; navbar.style.transform = ""; }
        words.forEach((w) => (w.style.transform = ""));
        if (dash) { dash.style.transform = ""; dash.style.transformOrigin = ""; }
        if (pill) { pill.style.transform = ""; }
        if (role) { role.style.opacity = ""; role.style.transform = ""; }
        if (shell) { shell.style.transform = ""; }
        setIsDone(true);
      }
    }

    function play() {
      if (cancelled) return;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }

    if (sig.decode) {
      sig.decode().then(play, play);
    } else if (sig.complete) {
      play();
    } else {
      sig.onload = play;
      sig.onerror = play;
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (isDone) return null;

  // Before hydration: hide the page so the hero never flashes before the curtain.
  if (!mounted) {
    return <style>{"#page-shell,#navbar{visibility:hidden}"}</style>;
  }

  // Render into <body> so position:fixed is relative to the viewport,
  // even if an ancestor (like #page-shell) has a CSS transform.
  return createPortal(
    <div
      ref={panelRef}
      className={inter.className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#151515",
        willChange: "clip-path",
      }}
    >
      <div style={{ width: "min(64vw, 440px)", padding: "0 20px", textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={sigRef}
          src="/websk-signature-white.png"
          alt="Websk"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            WebkitMaskImage: "linear-gradient(90deg, #000 -8%, transparent 0%)",
            maskImage: "linear-gradient(90deg, #000 -8%, transparent 0%)",
          }}
        />
        <div
          style={{
            marginTop: "clamp(8px, 2vw, 22px)",
            color: "#9a9cab",
            fontWeight: 500,
            fontSize: "clamp(13px, 1.5vw, 17px)",
            lineHeight: 1.55,
          }}
        >
          <span ref={t1Ref} style={{ display: "block", opacity: 0, transform: "translateY(8px)" }}>
            Web experiences
          </span>
          <span ref={t2Ref} style={{ display: "block", opacity: 0, transform: "translateY(8px)" }}>
            shaped by code, not templates.
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}