"use client";

/**
 * PageNavigator — global scroll-edge page navigation.
 *
 * Root cause of the cursor-position bug (documented):
 *
 *   OLD: The old navigator used bubble-phase (no capture:true).
 *   The Home page globe zoom handler used { capture:true, passive:false }
 *   and called e.preventDefault() in the capture phase. Since the navigator
 *   only listened in the bubble phase, events that the globe captured and
 *   called preventDefault() on never reached PageNavigator via atBottom().
 *   Because window.scrollY never changed (preventDefault blocked native scroll)
 *   the atBottom() check returned false. The only place it worked was when
 *   the cursor was over pointer-events:none elements (hero text) — there the
 *   globe's capture listener saw no pointer-events surface, didn't preventDefault,
 *   and scrollY changed normally. Hence the cursor-position dependency.
 *
 *   CURRENT FIX:
 *   - PageNavigator uses { capture:true, passive:true } — fires before all child
 *     listeners, never calls preventDefault, so it never blocks scrolling.
 *   - GlobeHero also uses { capture:true, passive:false } but ONLY on Home;
 *     when it calls preventDefault, PageNavigator's capture listener has already
 *     fired and read the deltaY — order within the same phase is registration order,
 *     so PageNavigator fires first (it was registered first in layout.tsx).
 *   - On Home, PageNavigator must NOT try to navigate with wheel — GlobeHero
 *     owns all wheel input on Home. PageNavigator only navigates on non-Home pages.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navDirection } from "@/lib/nav-direction";
import { homeEntry } from "@/lib/home-entry";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const PAGE_LABELS = ["Home", "About", "Services", "Work", "Contact"];

/** |deltaY| sum needed to trigger a page change */
const THRESHOLD = 400;
/** Reset accumulator after this many ms without wheel events */
const RESET_IDLE_MS = 250;
/** After navigation, ignore events for this long */
const COOLDOWN_MS = 1000;
/** Swipe px on mobile to trigger nav */
const TOUCH_THRESHOLD = 90;
/** Page must be at rest at this edge for this many ms before events count as intentional */
const EDGE_REST_MS = 150;
/** Gap from last wheel event that indicates a NEW gesture (inertia ended) */
const NEW_GESTURE_GAP_MS = 120;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  return tag === "input" || tag === "textarea" || tag === "select" ||
    (el as HTMLElement).isContentEditable;
}
function isLoaderPlaying(): boolean {
  return document.documentElement.dataset.loader === "playing";
}
/** Use scrollingElement for rubber-band safety on iOS Safari */
function getScrollEl(): Element {
  return document.scrollingElement || document.documentElement;
}
function atBottom(): boolean {
  const el = getScrollEl();
  return el.scrollTop + window.innerHeight >= el.scrollHeight - 4;
}
function atTop(): boolean {
  return getScrollEl().scrollTop <= 4;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PageNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const cooldown = useRef(false);
  const accumulated = useRef(0);
  const accumDir = useRef<"next" | "prev" | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheelTime = useRef(0);
  // Initialize edgeArrivalTime to a very old time so the first check always passes
  const edgeArrivalTime = useRef<Record<"top" | "bottom", number>>({
    top: Date.now() - 10000,    // treat page as "rested at top" from the start
    bottom: Date.now() - 10000, // treat page as "rested at bottom" from the start
  });
  const lastScrollTop = useRef<number | null>(null);

  // Touch
  const touchStartY = useRef(0);
  const touchStartAtTop = useRef(false);
  const touchStartAtBottom = useRef(false);

  // Progress bar (visual only)
  const [barVisible, setBarVisible] = useState(false);
  const [barPct, setBarPct] = useState(0);
  const [barDir, setBarDir] = useState<"next" | "prev">("next");
  const [targetLabel, setTargetLabel] = useState("");

  // Debug HUD
  const [debugInfo, setDebugInfo] = useState<{
    page: string; atTop: boolean; atBottom: boolean;
    acc: number; lastDy: number; targetTag: string; targetClass: string;
  } | null>(null);
  // showDebug is stable — read once from URL at mount
  const showDebugRef = useRef(false);
  useEffect(() => {
    showDebugRef.current = window.location.search.includes("debug=nav");
  }, []);
  const showDebug = typeof window !== "undefined" && window.location.search.includes("debug=nav");

  // ─── Navigate ──────────────────────────────────────────────────────────────
  const navigate = useCallback((dir: "next" | "prev") => {
    if (cooldown.current) return;
    const next = getNextPath(pathnameRef.current, dir);
    if (!next) return;

    cooldown.current = true;
    accumulated.current = 0;
    accumDir.current = null;
    setBarVisible(false);
    setBarPct(0);
    if (idleTimer.current) clearTimeout(idleTimer.current);

    // If navigating back to Home from About, set the fromAbout flag
    if (dir === "prev" && pathnameRef.current === "/about") {
      homeEntry.setFromAbout(true);
    }

    const pageEl = document.getElementById("page-content");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    navDirection.set(dir);

    const doNav = () => {
      router.push(next, { scroll: false });
      // Landing on a previous page: scroll to bottom so user arrives at the bottom
      if (dir === "prev" && next !== "/") {
        setTimeout(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
        }, 80);
      }
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    };

    if (pageEl && !reducedMotion) {
      const toScale = dir === "next" ? 1.08 : 0.94;
      pageEl.style.transition =
        "opacity 350ms cubic-bezier(0.65,0,0.35,1), transform 350ms cubic-bezier(0.65,0,0.35,1)";
      pageEl.style.opacity = "0";
      pageEl.style.transform = `scale(${toScale})`;
      setTimeout(doNav, 360);
    } else {
      doNav();
    }
  }, [router]);

  // ─── Reset accumulator ──────────────────────────────────────────────────────
  const resetAcc = useCallback(() => {
    accumulated.current = 0;
    accumDir.current = null;
    setBarVisible(false);
    setBarPct(0);
  }, []);

  // ─── Main effect ────────────────────────────────────────────────────────────
  useEffect(() => {
    // Stamp edge-arrival time on scroll so we know when the page reached an edge
    const trackEdge = () => {
      const el = getScrollEl();
      const st = el.scrollTop;
      const prev = lastScrollTop.current;
      const changed = prev === null || Math.abs(st - prev) > 0.5;
      lastScrollTop.current = st;

      if (!changed) return;
      const now = Date.now();
      if (atTop()) edgeArrivalTime.current.top = now;
      if (atBottom()) edgeArrivalTime.current.bottom = now;
    };

    // Stamp immediately for pages that load at top
    if (atTop()) edgeArrivalTime.current.top = Date.now() - EDGE_REST_MS;
    if (atBottom()) edgeArrivalTime.current.bottom = Date.now() - EDGE_REST_MS;

    window.addEventListener("scroll", trackEdge, { passive: true });

    // ── Wheel handler ─────────────────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;

      // Home page: GlobeHero owns ALL wheel input. PageNavigator does not navigate from Home.
      if (pathnameRef.current === "/") return;

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;

      // Skip horizontal-dominant scrolls
      if (Math.abs(dy) < Math.abs(e.deltaX)) return;

      // Pinch (ctrlKey): treat as strong scroll for nav purposes
      if (e.ctrlKey) {
        const dir: "next" | "prev" = e.deltaY > 0 ? "next" : "prev";
        const edge = dir === "next" ? atBottom() : atTop();
        if (edge && getNextPath(pathnameRef.current, dir)) {
          navigate(dir);
        }
        return;
      }

      const goingDown = dy > 0;
      const goingUp = dy < 0;
      const isAtBottom = atBottom();
      const isAtTop = atTop();

      // Debug HUD
      if (showDebugRef.current) {
        setDebugInfo({
          page: pathnameRef.current,
          atTop: isAtTop,
          atBottom: isAtBottom,
          acc: accumulated.current,
          lastDy: dy,
          targetTag: (e.target as HTMLElement)?.tagName ?? "?",
          targetClass: (e.target as HTMLElement)?.className?.toString().slice(0, 40) ?? "",
        });
      }

      // Not at an edge in the relevant direction → reset and let native scroll work
      if (goingDown && !isAtBottom) { resetAcc(); return; }
      if (goingUp && !isAtTop) { resetAcc(); return; }
      if (dy === 0) return;

      const dir: "next" | "prev" = goingDown ? "next" : "prev";

      // No page in that direction
      if (!getNextPath(pathnameRef.current, dir)) return;

      // ── Inertia filter ────────────────────────────────────────────────────
      const now = Date.now();
      const timeSinceLast = now - lastWheelTime.current;
      lastWheelTime.current = now;

      const edgeKey = dir === "next" ? "bottom" : "top";
      const restingMs = now - edgeArrivalTime.current[edgeKey];
      const isNewGesture = timeSinceLast >= NEW_GESTURE_GAP_MS;
      const isIntentional = restingMs >= EDGE_REST_MS || isNewGesture;

      if (!isIntentional) return; // momentum inertia — ignore silently

      // Direction flip → reset
      if (accumDir.current !== null && accumDir.current !== dir) {
        resetAcc();
        return;
      }
      accumDir.current = dir;

      // Accumulate
      accumulated.current += Math.abs(dy);

      // Idle reset timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(resetAcc, RESET_IDLE_MS);

      // Progress bar
      const pct = Math.min(1, accumulated.current / THRESHOLD);
      setBarDir(dir);
      setTargetLabel(getTargetLabel(pathnameRef.current, dir));
      setBarVisible(true);
      setBarPct(pct);

      // Navigate!
      if (accumulated.current >= THRESHOLD) {
        navigate(dir);
      }
    };

    // ── Touch ─────────────────────────────────────────────────────────────────
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
      touchStartAtBottom.current = atBottom();
      touchStartAtTop.current = atTop();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;
      if (pathnameRef.current === "/") return; // Home handles its own touch
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
      const dy = touchStartY.current - endY;
      if (dy > TOUCH_THRESHOLD && touchStartAtBottom.current) navigate("next");
      else if (dy < -TOUCH_THRESHOLD && touchStartAtTop.current) navigate("prev");
    };

    // Safari gesturechange
    const handleGestureChange = (e: Event) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;
      if (pathnameRef.current === "/") return;
      const ge = e as unknown as { scale: number };
      if (ge.scale > 1.15 && atBottom()) navigate("next");
      else if (ge.scale < 0.85 && atTop()) navigate("prev");
    };

    // capture:true — fires before any child. passive:true — never prevents scroll.
    window.addEventListener("wheel", handleWheel, { capture: true, passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("gesturechange", handleGestureChange);

    return () => {
      window.removeEventListener("scroll", trackEdge);
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("gesturechange", handleGestureChange);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [navigate, resetAcc]);

  // ─── Bar label ───────────────────────────────────────────────────────────────
  const barLabel = barDir === "next"
    ? `KEEP SCROLLING: ${targetLabel} ↓`
    : `↑ KEEP SCROLLING UP: ${targetLabel}`;

  return (
    <>
      {barVisible && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            zIndex: 9999, pointerEvents: "none",
            fontFamily: "var(--font-ibm-plex, monospace)",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6a6e90", whiteSpace: "nowrap" }}>
            {barLabel}
          </span>
          <div style={{ width: 120, height: 3, borderRadius: 999, background: "rgba(109,59,255,0.2)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${barPct * 100}%`, background: "#6D3BFF", borderRadius: 999, transition: "width 80ms linear" }} />
          </div>
        </div>
      )}

      {showDebug && debugInfo && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed", bottom: 16, left: 16, zIndex: 99999,
            background: "rgba(0,0,0,0.88)", border: "1px solid #6D3BFF",
            borderRadius: 8, padding: "10px 14px",
            fontFamily: "monospace", fontSize: 11, color: "#a99bff", lineHeight: 1.7,
            pointerEvents: "none", maxWidth: 380,
          }}
        >
          <div><b>page:</b> {debugInfo.page}</div>
          <div><b>atTop:</b> {String(debugInfo.atTop)} &nbsp; <b>atBottom:</b> {String(debugInfo.atBottom)}</div>
          <div><b>acc:</b> {debugInfo.acc.toFixed(1)} / {THRESHOLD}</div>
          <div><b>lastΔY:</b> {debugInfo.lastDy.toFixed(1)}</div>
          <div><b>target:</b> &lt;{debugInfo.targetTag.toLowerCase()}&gt; {debugInfo.targetClass}</div>
          <div style={{ color: "#6a6e90", fontSize: 10 }}>capture:true — cursor pos irrelevant ✓</div>
        </div>
      )}
    </>
  );
}
