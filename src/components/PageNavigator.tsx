"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navDirection } from "@/lib/nav-direction";

const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const PAGE_LABELS = ["Home", "About", "Services", "Work", "Contact"];

const ARM_DELAY_MS = 350;
const THRESHOLD = 500;        // accumulated px to trigger nav
const RESET_IDLE_MS = 250;    // reset accumulator after this ms of no wheel
const COOLDOWN_MS = 1000;
const TOUCH_THRESHOLD = 90;   // px swipe to trigger nav on mobile

function getNextPath(pathname: string, dir: "next" | "prev"): string | null {
  const idx = PAGES.indexOf(pathname);
  if (idx === -1) return null;
  const next = dir === "next" ? idx + 1 : idx - 1;
  if (next < 0 || next >= PAGES.length) return null;
  return PAGES[next];
}

function getTargetLabel(pathname: string, dir: "next" | "prev"): string {
  const idx = PAGES.indexOf(pathname);
  if (idx === -1) return "";
  const next = dir === "next" ? idx + 1 : idx - 1;
  if (next < 0 || next >= PAGES.length) return "";
  return PAGE_LABELS[next];
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || (el as HTMLElement).isContentEditable;
}

function isLoaderPlaying(): boolean {
  return document.documentElement.dataset.loader === "playing";
}

export function PageNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const cooldown = useRef(false);
  const armed = useRef<"next" | "prev" | null>(null);
  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulated = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch state
  const touchStartY = useRef(0);
  const touchStartAtTop = useRef(false);
  const touchStartAtBottom = useRef(false);

  // Progress bar state
  const [barVisible, setBarVisible] = useState(false);
  const [barPct, setBarPct] = useState(0);
  const [barDir, setBarDir] = useState<"next" | "prev">("next");
  const [targetLabel, setTargetLabel] = useState("");

  const navigate = useCallback((dir: "next" | "prev") => {
    if (cooldown.current) return;
    const next = getNextPath(pathnameRef.current, dir);
    if (!next) return;

    cooldown.current = true;
    armed.current = null;
    accumulated.current = 0;
    setBarVisible(false);
    setBarPct(0);

    // Run exit animation on current page content, then push
    const pageEl = document.getElementById("page-content");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    navDirection.set(dir);

    if (pageEl && !reducedMotion) {
      const toScale = dir === "next" ? 1.08 : 0.94;
      pageEl.style.transition =
        "opacity 350ms cubic-bezier(0.65,0,0.35,1), transform 350ms cubic-bezier(0.65,0,0.35,1)";
      pageEl.style.opacity = "0";
      pageEl.style.transform = `scale(${toScale})`;
      setTimeout(() => {
        router.push(next, { scroll: false });
        setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
      }, 360);
    } else {
      router.push(next, { scroll: false });
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    }
  }, [router]);

  useEffect(() => {
    const atBottom = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const atTop = () => window.scrollY <= 0;

    // ── Wheel / pinch ──────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;

      // ctrlKey = pinch / ctrl+scroll — always prevent browser zoom
      if (e.ctrlKey) {
        e.preventDefault();
        // Pinch-out (scale > 0, deltaY < 0 = zoom in) → treat as scroll-down = next
        // Pinch-in (deltaY > 0 = zoom out) → treat as scroll-up = prev
        const pinchNext = e.deltaY < 0;
        const dir = pinchNext ? "next" : "prev";
        const atEdge = pinchNext ? atBottom() : atTop();
        if (atEdge) navigate(dir);
        return;
      }

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (Math.abs(dy) < Math.abs(e.deltaX)) return; // horizontal scroll

      const goingDown = dy > 0;
      const goingUp = dy < 0;

      const edgeDown = goingDown && atBottom();
      const edgeUp = goingUp && atTop();
      const atEdge = edgeDown || edgeUp;

      if (!atEdge) {
        // Moving away from edge — reset
        armed.current = null;
        accumulated.current = 0;
        if (armTimer.current) clearTimeout(armTimer.current);
        setBarVisible(false);
        setBarPct(0);
        return;
      }

      const dir: "next" | "prev" = edgeDown ? "next" : "prev";

      // No further page? Do nothing
      if (!getNextPath(pathnameRef.current, dir)) return;

      // Arm delay
      if (armed.current !== dir) {
        armed.current = null;
        accumulated.current = 0;
        if (armTimer.current) clearTimeout(armTimer.current);
        armTimer.current = setTimeout(() => {
          armed.current = dir;
          accumulated.current = 0;
        }, ARM_DELAY_MS);
        return;
      }

      // Accumulate
      accumulated.current += Math.abs(dy);

      // Reset idle timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        accumulated.current = 0;
        armed.current = null;
        setBarVisible(false);
        setBarPct(0);
      }, RESET_IDLE_MS);

      const pct = Math.min(1, accumulated.current / THRESHOLD);
      setBarDir(dir);
      setTargetLabel(getTargetLabel(pathnameRef.current, dir));
      setBarVisible(true);
      setBarPct(pct);

      if (accumulated.current >= THRESHOLD) {
        navigate(dir);
      }
    };

    // ── Touch ───────────────────────────────────────────────────────
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartAtBottom.current = atBottom();
      touchStartAtTop.current = atTop();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
      const dy = touchStartY.current - endY; // positive = swipe up

      if (dy > TOUCH_THRESHOLD && touchStartAtBottom.current) {
        navigate("next");
      } else if (dy < -TOUCH_THRESHOLD && touchStartAtTop.current) {
        navigate("prev");
      }
    };

    // Safari gesturechange
    const handleGestureChange = (e: Event) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;
      const ge = e as unknown as { scale: number };
      if (ge.scale > 1.15 && atBottom()) navigate("next");
      else if (ge.scale < 0.85 && atTop()) navigate("prev");
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("gesturechange", handleGestureChange);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("gesturechange", handleGestureChange);
      if (armTimer.current) clearTimeout(armTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [navigate]);

  if (!barVisible) return null;

  const label =
    barDir === "next"
      ? `KEEP SCROLLING: ${targetLabel} ↓`
      : `↑ KEEP SCROLLING UP: ${targetLabel}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: barVisible ? 1 : 0,
        transition: "opacity 300ms ease",
        fontFamily: "var(--font-ibm-plex, monospace)",
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#6a6e90",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 120,
          height: 3,
          borderRadius: 999,
          background: "rgba(109,59,255,0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barPct * 100}%`,
            background: "#6D3BFF",
            borderRadius: 999,
            transition: "width 80ms linear",
          }}
        />
      </div>
    </div>
  );
}
