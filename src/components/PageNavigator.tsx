"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navDirection } from "@/lib/nav-direction";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const PAGE_LABELS = ["Home", "About", "Services", "Work", "Contact"];
const THRESHOLD = 400;           // accumulated |deltaY| px to trigger navigation
const RESET_IDLE_MS = 250;       // reset accumulator if no wheel events for this long
const COOLDOWN_MS = 1000;        // after navigation, ignore events for this long
const TOUCH_THRESHOLD = 90;      // px swipe needed on mobile
const EDGE_REST_MS = 150;        // page must be at rest at edge for this long before counting events
const NEW_GESTURE_GAP_MS = 120;  // gap since last wheel event that marks a NEW gesture (inertia ended)

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
  return tag === "input" || tag === "textarea" || tag === "select" || (el as HTMLElement).isContentEditable;
}
function isLoaderPlaying(): boolean {
  return document.documentElement.dataset.loader === "playing";
}
// Use document.scrollingElement for rubber-band safety
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

  // ── State refs (avoid closure stale values) ───────────────────────────────
  const cooldown = useRef(false);
  const accumulated = useRef(0);
  const accumDir = useRef<"next" | "prev" | null>(null); // direction of current accumulation
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheelTime = useRef(0); // ms of last wheel event
  const edgeArrivalTime = useRef<Record<"top" | "bottom", number>>({ top: 0, bottom: 0 });
  const lastScrollTop = useRef(0); // detect that page has been at rest

  // Touch state
  const touchStartY = useRef(0);
  const touchStartAtTop = useRef(false);
  const touchStartAtBottom = useRef(false);

  // Progress bar state (visual only)
  const [barVisible, setBarVisible] = useState(false);
  const [barPct, setBarPct] = useState(0);
  const [barDir, setBarDir] = useState<"next" | "prev">("next");
  const [targetLabel, setTargetLabel] = useState("");

  // Debug HUD state
  const [debugInfo, setDebugInfo] = useState<{
    page: string; atTop: boolean; atBottom: boolean;
    acc: number; lastDy: number; targetTag: string; targetClass: string;
  } | null>(null);
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

    const pageEl = document.getElementById("page-content");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    navDirection.set(dir);

    const doNav = () => {
      router.push(next, { scroll: false });
      // If going prev, land at bottom of previous page after transition
      if (dir === "prev") {
        setTimeout(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
        }, 50);
      }
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    };

    if (pageEl && !reducedMotion) {
      const toScale = dir === "next" ? 1.08 : 0.94;
      pageEl.style.transition = "opacity 350ms cubic-bezier(0.65,0,0.35,1), transform 350ms cubic-bezier(0.65,0,0.35,1)";
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
    // Track edge arrival times and scroll position
    const trackEdge = () => {
      const el = getScrollEl();
      const st = el.scrollTop;
      const changed = Math.abs(st - lastScrollTop.current) > 1;
      lastScrollTop.current = st;

      const now = Date.now();
      if (atTop() && changed) edgeArrivalTime.current.top = now;
      if (atBottom() && changed) edgeArrivalTime.current.bottom = now;
    };

    window.addEventListener("scroll", trackEdge, { passive: true });

    // ── Wheel handler (capture phase — fires before everything else) ──────────
    const handleWheel = (e: WheelEvent) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;

      // Skip horizontal-dominant scrolls
      if (Math.abs(dy) < Math.abs(e.deltaX)) return;

      const now = Date.now();
      const timeSinceLast = now - lastWheelTime.current;
      lastWheelTime.current = now;

      // ── Pinch (ctrlKey) at edges → page navigation ────────────────────────
      if (e.ctrlKey) {
        // BUG 1: pinch is handled by Home's capture listener; don't double-handle here
        // Only use for page nav when at edge
        const pinchDown = e.deltaY > 0; // pinch-in = zoom out = prev
        const dir = pinchDown ? "prev" : "next";
        const edge = pinchDown ? atTop() : atBottom();
        if (edge && getNextPath(pathnameRef.current, dir)) {
          navigate(dir);
        }
        return;
      }

      const goingDown = dy > 0;
      const goingUp = dy < 0;

      const isAtBottom = atBottom();
      const isAtTop = atTop();

      // ── Update debug ────────────────────────────────────────────────────────
      if (showDebug) {
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

      // ── Not at an edge in the relevant direction → reset ──────────────────
      if (goingDown && !isAtBottom) { resetAcc(); return; }
      if (goingUp && !isAtTop) { resetAcc(); return; }
      if (dy === 0) return;

      const dir: "next" | "prev" = goingDown ? "next" : "prev";

      // No further page in this direction? → do nothing
      if (!getNextPath(pathnameRef.current, dir)) return;

      // ── Inertia filtering ──────────────────────────────────────────────────
      // An event is intentional if:
      //   a) The page has been resting at this edge for >= EDGE_REST_MS, OR
      //   b) This event starts a NEW gesture (gap >= NEW_GESTURE_GAP_MS since last event)
      const edgeKey = dir === "next" ? "bottom" : "top";
      const restingMs = now - edgeArrivalTime.current[edgeKey];
      const isNewGesture = timeSinceLast >= NEW_GESTURE_GAP_MS;
      const isIntentional = restingMs >= EDGE_REST_MS || isNewGesture;

      if (!isIntentional) {
        // Momentum inertia — ignore but don't reset
        return;
      }

      // ── Direction flip → reset ─────────────────────────────────────────────
      if (accumDir.current !== null && accumDir.current !== dir) {
        resetAcc();
        return;
      }
      accumDir.current = dir;

      // ── Accumulate ────────────────────────────────────────────────────────
      accumulated.current += Math.abs(dy);

      // Reset idle timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => { resetAcc(); }, RESET_IDLE_MS);

      // Update progress bar
      const pct = Math.min(1, accumulated.current / THRESHOLD);
      setBarDir(dir);
      setTargetLabel(getTargetLabel(pathnameRef.current, dir));
      setBarVisible(true);
      setBarPct(pct);

      // ── Trigger navigation ────────────────────────────────────────────────
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
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
      const dy = touchStartY.current - endY; // positive = swipe up
      if (dy > TOUCH_THRESHOLD && touchStartAtBottom.current) navigate("next");
      else if (dy < -TOUCH_THRESHOLD && touchStartAtTop.current) navigate("prev");
    };

    // Safari gesturechange
    const handleGestureChange = (e: Event) => {
      if (isLoaderPlaying() || isInputFocused() || cooldown.current) return;
      const ge = e as unknown as { scale: number };
      if (ge.scale > 1.15 && atBottom()) navigate("next");
      else if (ge.scale < 0.85 && atTop()) navigate("prev");
    };

    // IMPORTANT: capture:true so we see events before any child listener.
    // passive:false NOT needed here since we never call preventDefault in PageNavigator.
    // The globe zoom handler (page.tsx) handles its own preventDefault in capture phase too.
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
  }, [navigate, resetAcc, showDebug]);

  // ─── Render ───────────────────────────────────────────────────────────────
  const barLabel = barDir === "next"
    ? `KEEP SCROLLING: ${targetLabel} ↓`
    : `↑ KEEP SCROLLING UP: ${targetLabel}`;

  return (
    <>
      {/* Progress bar */}
      {barVisible && (
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

      {/* Debug HUD — only shown with ?debug=nav */}
      {showDebug && debugInfo && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            zIndex: 99999,
            background: "rgba(0,0,0,0.85)",
            border: "1px solid #6D3BFF",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "monospace",
            fontSize: 11,
            color: "#a99bff",
            lineHeight: 1.7,
            pointerEvents: "none",
            maxWidth: 360,
          }}
        >
          <div><b>page:</b> {debugInfo.page}</div>
          <div><b>atTop:</b> {String(debugInfo.atTop)} &nbsp; <b>atBottom:</b> {String(debugInfo.atBottom)}</div>
          <div><b>acc:</b> {debugInfo.acc.toFixed(1)} / {THRESHOLD}</div>
          <div><b>lastΔY:</b> {debugInfo.lastDy.toFixed(1)}</div>
          <div><b>target:</b> &lt;{debugInfo.targetTag.toLowerCase()}&gt; {debugInfo.targetClass}</div>
          <div style={{ color: "#6a6e90", fontSize: 10 }}>cursor pos: irrelevant ✓</div>
        </div>
      )}
    </>
  );
}
