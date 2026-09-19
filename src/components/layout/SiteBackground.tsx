"use client";

import { useEffect, useRef } from "react";

interface SiteBackgroundProps {
  shoot?: boolean;
}

export function SiteBackground({ shoot = false }: SiteBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      last = 0,
      nextShoot = 2200,
      running = false;
    let stars: {x: number, y: number, z: number, r: number, tw: number, sp: number, c: string}[] = [];
    const shoots: {x: number, y: number, vx: number, vy: number, life: number, age: number}[] = [];
    const tints = ["255,255,255", "255,255,255", "205,215,255", "225,205,255"];

    function build() {
      const isMobile = window.innerWidth < 768;
      // "fewer stars on mobile" - reduce the base count slightly if mobile, but prototype scaling already does w*h.
      // Prototype: Math.max(90,Math.min(Math.round(w*h/5200),340))
      const maxStars = isMobile ? 180 : 340;
      const minStars = isMobile ? 40 : 90;
      const n = Math.max(minStars, Math.min(Math.round((w * h) / 5200), maxStars));
      stars = [];
      for (let i = 0; i < n; i++) {
        const big = Math.random() > 0.88;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.35 + Math.random() * 0.65,
          r: big ? 1.1 + Math.random() * 0.9 : 0.35 + Math.random() * 0.75,
          tw: Math.random() * 6.28,
          sp: 0.5 + Math.random() * 1.6,
          c: tints[Math.floor(Math.random() * tints.length)],
        });
      }
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(0, 0);
    }

    function draw(t: number, dt: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!reduce) {
          s.x -= 0.006 * dt * s.z;
          if (s.x < -2) s.x = w + 2;
        }
        const a = (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.sp + s.tw))) * (0.45 + 0.55 * s.z);
        ctx.fillStyle = "rgba(" + s.c + "," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
        if (s.r > 1.1) {
          ctx.fillStyle = "rgba(" + s.c + "," + (a * 0.14).toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.2, 0, 6.283);
          ctx.fill();
        }
      }
      for (let j = shoots.length - 1; j >= 0; j--) {
        const m = shoots[j];
        m.age += dt;
        const k = m.age / m.life;
        if (k >= 1) {
          shoots.splice(j, 1);
          continue;
        }
        m.x += (m.vx * dt) / 1000;
        m.y += (m.vy * dt) / 1000;
        const tx = m.x - m.vx * 0.09,
          ty = m.y - m.vy * 0.09;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        const al = (1 - k) * 0.9;
        g.addColorStop(0, "rgba(255,255,255," + al + ")");
        g.addColorStop(1, "rgba(160,130,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    }

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(now - (last || now), 50);
      last = now;
      if (shoot && !reduce) {
        nextShoot -= dt;
        if (nextShoot <= 0) {
          nextShoot = 2600 + Math.random() * 3200;
          shoots.push({
            x: Math.random() * w * 0.8 + w * 0.15,
            y: Math.random() * h * 0.35,
            vx: -520 - Math.random() * 260,
            vy: 300 + Math.random() * 180,
            life: 900,
            age: 0,
          });
        }
      }
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (reduce || running) {
        if (reduce) draw(0, 0); // draw once statically
        return;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // Visibility change logic to pause animation
    function handleVisibility() {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    
    resize();
    if (!document.hidden) {
      start();
    }

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [shoot]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,#0a0b2a_0%,#03040f_55%,#010208_100%)]" />
      <div
        className="absolute inset-[-20%] pointer-events-none mix-blend-screen"
        style={{
          background: `
            radial-gradient(38% 34% at 18% 24%, rgba(109,59,255,.20), transparent 70%),
            radial-gradient(34% 30% at 82% 68%, rgba(59,43,224,.18), transparent 70%),
            radial-gradient(30% 26% at 55% 105%, rgba(109,59,255,.14), transparent 70%),
            radial-gradient(22% 18% at 75% 12%, rgba(120,90,255,.08), transparent 70%)
          `,
          animation: "drift 28s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.55) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift {
          from { transform: translate3d(-2%, -1%, 0) scale(1); }
          to { transform: translate3d(2%, 1.5%, 0) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mix-blend-screen { animation: none !important; }
        }
      `}} />
    </div>
  );
}
