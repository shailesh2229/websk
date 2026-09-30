"use client";

/**
 * GlobeHero — Three.js "fly into the globe" hero, ported from
 * /reference/websk-globe-fly-preview.html to React + @react-three/fiber.
 *
 * Scroll drives `depth` (0..1):
 *   0 = camera outside the globe looking at it
 *   1 = camera fully inside, with the globe zooming in as the section scrolls
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const AUTO_ROTATION = 0.16;

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

function randomSpherePoints(n: number, rmin: number, rmax: number): Float32Array {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * 6.2832;
    const s = Math.sqrt(1 - u * u);
    const r = rmin + Math.random() * (rmax - rmin);
    a[i * 3] = r * s * Math.cos(th);
    a[i * 3 + 1] = r * u;
    a[i * 3 + 2] = r * s * Math.sin(th);
  }
  return a;
}

export function GlobeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    depth: 0,
    disp: 0,
    dragging: false,
    lx: 0,
    ly: 0,
    velY: 0,
  });
  const rafRef = useRef(0);
  const lastFrameTime = useRef(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroScale, setHeroScale] = useState(1);
  const [heroBlur, setHeroBlur] = useState(0);
  const reduce = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateDepth = () => {
      const total = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      const scrollInWrapper = clamp(window.scrollY - (wrapper.offsetTop || 0), 0, total);
      stateRef.current.depth = clamp(scrollInWrapper / total, 0, 1);
    };

    const onScroll = () => updateDepth();
    const onResize = () => updateDepth();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateDepth();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.02, 200);
    camera.position.z = 3.3;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    tilt.rotation.x = 0.42;
    tilt.rotation.z = 0.14;
    tilt.add(spin);
    scene.add(tilt);

    const ico = new THREE.IcosahedronGeometry(1, 5);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xa99bff, transparent: true, opacity: 0.22, depthWrite: false,
    });
    spin.add(new THREE.LineSegments(new THREE.WireframeGeometry(ico), wireMat));

    const mkDots = (arr: Float32Array, size: number, color: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const m = new THREE.PointsMaterial({
        color, size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false,
      });
      return new THREE.Points(g, m);
    };

    spin.add(mkDots(randomSpherePoints(1400, 1.0, 1.0), 0.014, 0xffffff, 0.75));
    spin.add(mkDots(randomSpherePoints(900, 0.12, 0.97), 0.011, 0xcfc8ff, 0.55));
    scene.add(mkDots(randomSpherePoints(1800, 8, 40), 0.09, 0xe1e4ff, 0.8));

    const state = stateRef.current;

    const frame = (t: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (document.hidden) return;

      const dt = Math.min(((t - lastFrameTime.current) / 1000) || 0.016, 0.05);
      lastFrameTime.current = t;

      state.disp += (state.depth - state.disp) * (reduce ? 1 : Math.min(1, dt * 7));
      const e = state.disp;

      camera.position.z = 3.3 - 3.7 * e;
      camera.fov = 58 + 48 * e;
      camera.updateProjectionMatrix();
      camera.rotation.z = e * 0.28;
      wireMat.opacity = 0.2 + 0.55 * e;

      const autoSpeed = reduce ? 0 : (AUTO_ROTATION + e * 1.1);
      spin.rotation.y += (autoSpeed + (state.dragging ? 0 : state.velY)) * dt;
      state.velY *= Math.pow(0.03, dt);

      renderer.render(scene, camera);

      setHeroOpacity(clamp(1 - e * 1.9, 0, 1));
      setHeroScale(1 + e * 1.5);
      setHeroBlur(e > 0.02 ? e * 9 : 0);
    };

    rafRef.current = requestAnimationFrame(frame);

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.dragging = true;
      state.lx = e.clientX;
      state.ly = e.clientY;
    };
    const onPointerUp = () => { state.dragging = false; };
    const onPointerMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.lx;
      const dy = e.clientY - state.ly;
      state.lx = e.clientX;
      state.ly = e.clientY;
      spin.rotation.y += dx * 0.006;
      state.velY = dx * 0.006 * 60;
      tilt.rotation.x = clamp(tilt.rotation.x + dy * 0.004, -0.3, 1.1);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
    };
  }, [reduce]);

  return (
    <div ref={wrapperRef} className="relative block" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 0 }}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
          aria-hidden="true"
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%,-50%) scale(${heroScale.toFixed(3)})`,
            opacity: heroOpacity.toFixed(3),
            filter: heroBlur > 0.1 ? `blur(${heroBlur.toFixed(1)}px)` : "none",
            width: "min(92vw, 900px)",
            textAlign: "center",
            pointerEvents: "none",
            willChange: "transform, opacity, filter",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-ibm-plex, monospace)",
              fontWeight: 700,
              fontSize: "clamp(64px, 11.5vw, 168px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "#fff",
            }}
          >
            WEBSK
          </h1>
          <h2
            style={{
              marginTop: "clamp(18px, 3vh, 34px)",
              fontWeight: 700,
              fontSize: "clamp(22px, 3.4vw, 50px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#f1f1f8",
              fontFamily: "var(--font-ibm-plex, monospace)",
            }}
          >
            Your tech partner.<br />Shailesh.
          </h2>
          <p
            style={{
              margin: "clamp(14px, 2.4vh, 24px) auto 0",
              maxWidth: 560,
              fontSize: "clamp(12px, 1.05vw, 15px)",
              lineHeight: 1.7,
              color: "#c9cade",
              fontFamily: "var(--font-ibm-plex, monospace)",
            }}
          >
            Custom websites, designed and coded from scratch. Fast, modern, and built for your business.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "calc(6vh + env(safe-area-inset-bottom, 0px))",
            textAlign: "center",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6a6e90",
            pointerEvents: "none",
            fontFamily: "var(--font-ibm-plex, monospace)",
          }}
        >
          <span className="globe-cue-nudge">Scroll or pinch to enter the globe ↓</span>
        </div>
      </div>

      <style>{`
        .globe-cue-nudge { display: inline-block; animation: globe-nudge 1.6s ease-in-out infinite; }
        @keyframes globe-nudge { 50% { transform: translateY(5px); } }
        @media (prefers-reduced-motion: reduce) { .globe-cue-nudge { animation: none; } }
      `}</style>
    </div>
  );
}
