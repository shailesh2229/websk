"use client";

/**
 * GlobeHero — Three.js "fly into the globe" hero, ported from
 * /reference/websk-globe-fly-preview.html to React + @react-three/fiber.
 *
 * Scroll/pinch/swipe on Home drives `depth` (0..1):
 *   0 = camera outside the globe looking at it
 *   1 = camera fully inside → auto-navigate to /about
 *
 * Coming back from /about starts depth=1 and animates to 0 (fly-out).
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { navDirection } from "@/lib/nav-direction";
import { homeEntry } from "@/lib/home-entry";

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPTH_WHEEL_SENS = 1 / 1500;      // wheel deltaY → depth delta
const DEPTH_PINCH_SENS = 1 / 220;       // ctrlKey deltaY → depth delta (inverted)
const DEPTH_GESTURE_SENS = 1.1;         // Safari gesturechange scale delta multiplier
const DEPTH_TOUCH_SENS = 1 / 520;       // touch swipe dy → depth delta
const AUTO_CONTINUE_SPEED = 0.8;        // depth/s when idling above 0.45
const AUTO_RETURN_SPEED = 0.9;          // depth/s when idling below 0.45
const IDLE_THRESHOLD_MS = 650;          // ms without input before auto-continue/return
const FLY_OUT_DURATION = 1.7;           // seconds to animate from depth=1 to 0 (fly-out)
const AUTO_ROTATION = 0.16;             // rad/s base globe rotation

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

// ─── Random sphere point cloud ────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
export function GlobeHero({ onNavigateToAbout }: { onNavigateToAbout?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    depth: homeEntry.fromAbout ? 1 : 0,
    disp: homeEntry.fromAbout ? 1 : 0,
    lastInput: 0,
    phase: homeEntry.fromAbout ? "toHome" as "home" | "toHome" | "toAbout" : "home" as "home" | "toHome" | "toAbout",
    velY: 0,
    dragging: false,
    lx: 0, ly: 0,
    prevScale: 1,
    navigated: false,
  });
  const rafRef = useRef(0);
  const lastFrameTime = useRef(0);
  const [heroOpacity, setHeroOpacity] = useState(homeEntry.fromAbout ? 0 : 1);
  const [heroScale, setHeroScale] = useState(homeEntry.fromAbout ? 2.5 : 1);
  const [heroBlur, setHeroBlur] = useState(homeEntry.fromAbout ? 9 : 0);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const router = useRouter();
  const reduce = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Clear the fromAbout flag after mount so next direct visit starts fresh
  useEffect(() => {
    homeEntry.setFromAbout(false);
  }, []);

  const handleNavigateToAbout = useCallback(() => {
    if (stateRef.current.navigated) return;
    stateRef.current.navigated = true;
    setCanvasOpacity(0);
    navDirection.set("next");
    if (onNavigateToAbout) onNavigateToAbout();
    setTimeout(() => {
      router.push("/about", { scroll: false });
    }, 400);
  }, [router, onNavigateToAbout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer setup ────────────────────────────────────────────────────────
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

    // ── Globe geometry ────────────────────────────────────────────────────────
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

    // Surface dots (1400)
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
    // Far stars (not inside spin — they stay fixed while globe rotates)
    scene.add(mkDots(randomSpherePoints(1800, 8, 40), 0.09, 0xe1e4ff, 0.8));

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const state = stateRef.current;

    const frame = (t: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (document.hidden) return;

      const dt = Math.min(((t - lastFrameTime.current) / 1000) || 0.016, 0.05);
      lastFrameTime.current = t;

      const now = performance.now();

      // ── State machine ─────────────────────────────────────────────────────
      if (state.phase === "home") {
        if (!reduce && now - state.lastInput > IDLE_THRESHOLD_MS) {
          if (state.depth >= 0.45) {
            state.depth = Math.min(1, state.depth + dt * AUTO_CONTINUE_SPEED);
          } else if (state.depth > 0) {
            state.depth = Math.max(0, state.depth - dt * AUTO_RETURN_SPEED);
          }
        }
        if (state.depth >= 0.998) {
          state.phase = "toAbout";
          handleNavigateToAbout();
        }
      } else if (state.phase === "toHome") {
        state.depth = Math.max(0, state.depth - dt / FLY_OUT_DURATION);
        if (state.depth <= 0.001) {
          state.phase = "home";
          state.lastInput = now;
        }
      }
      // "toAbout": just let disp animate to 1, then we've navigated

      // ── Lerp display value ────────────────────────────────────────────────
      state.disp += (state.depth - state.disp) * (reduce ? 1 : Math.min(1, dt * 7));
      const e = state.disp;

      // ── Camera ────────────────────────────────────────────────────────────
      camera.position.z = 3.3 - 3.7 * e;
      camera.fov = 58 + 48 * e;
      camera.updateProjectionMatrix();
      camera.rotation.z = e * 0.28;
      wireMat.opacity = 0.2 + 0.55 * e;

      // ── Globe rotation ────────────────────────────────────────────────────
      const autoSpeed = reduce ? 0 : (AUTO_ROTATION + e * 1.1);
      spin.rotation.y += (autoSpeed + (state.dragging ? 0 : state.velY)) * dt;
      state.velY *= Math.pow(0.03, dt);

      renderer.render(scene, camera);

      // ── Hero text ─────────────────────────────────────────────────────────
      setHeroOpacity(clamp(1 - e * 1.9, 0, 1));
      setHeroScale(1 + e * 1.5);
      setHeroBlur(e > 0.02 ? e * 9 : 0);
    };

    rafRef.current = requestAnimationFrame(frame);

    // ── Input: drag to rotate ─────────────────────────────────────────────────
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
      state.lx = e.clientX; state.ly = e.clientY;
      spin.rotation.y += dx * 0.006;
      state.velY = dx * 0.006 * 60;
      tilt.rotation.x = clamp(tilt.rotation.x + dy * 0.004, -0.3, 1.1);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // ── Input: wheel / pinch (capture, passive:false so we can preventDefault) ─
    const addDepth = (dv: number) => {
      if (state.phase !== "home") return;
      state.depth = clamp(state.depth + dv, 0, 1);
      state.lastInput = performance.now();
    };

    const onWheel = (e: WheelEvent) => {
      if (state.phase !== "home" && state.phase !== "toHome") return;
      e.preventDefault();
      if (state.phase === "toHome") {
        // Allow the fly-out to be interrupted: zoom out gesture = let fly-out continue naturally
        return;
      }
      if (e.ctrlKey) {
        addDepth(-e.deltaY * DEPTH_PINCH_SENS);
      } else {
        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16;
        else if (e.deltaMode === 2) dy *= window.innerHeight;
        if (Math.abs(dy) >= Math.abs(e.deltaX)) {
          addDepth(dy * DEPTH_WHEEL_SENS);
        }
      }
    };

    // ── Safari gesturechange ──────────────────────────────────────────────────
    let prevScale = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      prevScale = 1;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      if (state.phase === "home") {
        const ge = e as unknown as { scale: number };
        addDepth((ge.scale - prevScale) * DEPTH_GESTURE_SENS);
        prevScale = ge.scale;
      }
    };

    // ── Touch swipe ──────────────────────────────────────────────────────────
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      if (state.phase === "home") addDepth(dy * DEPTH_TOUCH_SENS);
    };

    // Capture phase: capture wheel before PageNavigator so we get to call preventDefault
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("gesturestart", onGestureStart);
    window.addEventListener("gesturechange", onGestureChange);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("gesturestart", onGestureStart);
      window.removeEventListener("gesturechange", onGestureChange);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      renderer.dispose();
    };
  }, [handleNavigateToAbout, reduce]);

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", display: "block",
          transition: "opacity 0.8s ease",
          opacity: canvasOpacity,
        }}
        aria-hidden="true"
      />

      {/* Hero text layer — scales and fades as depth increases */}
      <div
        style={{
          position: "fixed",
          left: "50%", top: "50%",
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

      {/* Scroll hint */}
      <div
        style={{
          position: "fixed",
          left: 0, right: 0,
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

      <style>{`
        .globe-cue-nudge { display: inline-block; animation: globe-nudge 1.6s ease-in-out infinite; }
        @keyframes globe-nudge { 50% { transform: translateY(5px); } }
        @media (prefers-reduced-motion: reduce) { .globe-cue-nudge { animation: none; } }
      `}</style>
    </div>
  );
}
