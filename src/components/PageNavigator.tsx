"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navDirection } from "@/lib/nav-direction";
import { homeEntry } from "@/lib/home-entry";

const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const PAGE_LABELS = ["Home", "About", "Services", "Work", "Contact"];

const GESTURE_GAP = 200;      // ms: gap larger than this = new gesture
const QUIET_AFTER_NAV = 250;  // ms: unlock only when wheel silent for this long after nav
const EDGE_REST = 150;        // ms: must have rested at edge before a gesture counts

function pendingDirFromStorage(): "up" | "down" | null {
  try {
    const d = sessionStorage.getItem("nav-dir") as "up" | "down" | null;
    sessionStorage.removeItem("nav-dir");
    return d;
  } catch { return null; }
}

export function PageNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const [hud, setHud] = useState<Record<string, unknown> | null>(null);
  const [debug, setDebug] = useState(false);

  // ── progress bar ────────────────────────────────────────────────────────────
  const [barVisible, setBarVisible] = useState(false);
  const [barLabel, setBarLabel] = useState("");

  const s = useRef({
    lastWheel: 0,
    gestureId: 0,
    locked: false,
    edgeSince: { top: 0, bottom: 0 },
    gestureStartedAtEdge: { top: false, bottom: false },
    pendingDir: null as null | "up" | "down",
  });

  useEffect(() => {
    setDebug(new URLSearchParams(location.search).get("debug") === "nav");
  }, []);

  const scroller = () =>
    (document.scrollingElement || document.documentElement) as HTMLElement;
  const atTop = () => scroller().scrollTop <= 1;
  const atBottom = () =>
    scroller().scrollTop + window.innerHeight >= scroller().scrollHeight - 2;

  // After route changes: set scroll position, then unlock when wheel goes quiet
  useEffect(() => {
    const st = s.current;
    const dir = pendingDirFromStorage();
    st.locked = true;
    st.pendingDir = dir;
    setBarVisible(false);

    // Wait for content to render, then set scroll position
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (dir === "up") {
          // Arrived from a "next" navigation — stay at top
          window.scrollTo(0, 0);
        } else if (dir === "down") {
          // Arrived going back — scroll to bottom
          window.scrollTo(0, scroller().scrollHeight);
        }
      });
    });

    // Unlock: only when wheel has been quiet for QUIET_AFTER_NAV ms
    const t = setInterval(() => {
      if (performance.now() - st.lastWheel > QUIET_AFTER_NAV) {
        st.locked = false;
        const now = performance.now();
        st.edgeSince = { top: now, bottom: now };
        st.gestureStartedAtEdge = { top: false, bottom: false };
        clearInterval(t);
      }
    }, 50);

    return () => {
      cancelAnimationFrame(id);
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const st = s.current;

    const onScroll = () => {
      const now = performance.now();
      if (!atTop()) st.edgeSince.top = now;
      if (!atBottom()) st.edgeSince.bottom = now;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let GlobeHero / browser handle pinch
      const now = performance.now();
      const fresh = now - st.lastWheel > GESTURE_GAP;
      st.lastWheel = now;

      // Locked after nav: swallow event to prevent inertia bleed
      if (st.locked) {
        e.preventDefault();
        return;
      }

      if (fresh) {
        st.gestureId++;
        // Record whether the fresh gesture started while resting at an edge
        st.gestureStartedAtEdge.top =
          atTop() && now - st.edgeSince.top >= EDGE_REST;
        st.gestureStartedAtEdge.bottom =
          atBottom() && now - st.edgeSince.bottom >= EDGE_REST;
      }

      const i = PAGES.indexOf(pathname);
      const down = e.deltaY > 0;
      const isTop = atTop();
      const isBottom = atBottom();

      if (debug) {
        setHud({
          page: pathname,
          scrollTop: Math.round(scroller().scrollTop),
          scrollHeight: scroller().scrollHeight,
          atTop: isTop,
          atBottom: isBottom,
          startedTop: st.gestureStartedAtEdge.top,
          startedBottom: st.gestureStartedAtEdge.bottom,
          deltaY: Math.round(e.deltaY),
          fresh,
          locked: st.locked,
          target: (e.target as HTMLElement)?.tagName,
        });
      }

      const navigate = (dir: "up" | "down", target: string) => {
        e.preventDefault();
        st.locked = true;
        setBarVisible(false);

        // Set direction store for template.tsx enter animation and homeEntry fly-out
        if (dir === "up") {
          navDirection.set("prev");
          if (pathname === "/about") {
            homeEntry.setFromAbout(true);
          }
        } else {
          navDirection.set("next");
        }

        // Store direction so the arriving page knows where to scroll
        try { sessionStorage.setItem("nav-dir", dir); } catch { /* ignore */ }

        // Exit animation on current page
        const pageEl = document.getElementById("page-content");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (pageEl && !reducedMotion) {
          const toScale = dir === "down" ? 1.08 : 0.94;
          pageEl.style.transition =
            "opacity 320ms cubic-bezier(0.65,0,0.35,1), transform 320ms cubic-bezier(0.65,0,0.35,1)";
          pageEl.style.opacity = "0";
          pageEl.style.transform = `scale(${toScale})`;
          setTimeout(() => router.push(target, { scroll: false }), 330);
        } else {
          router.push(target, { scroll: false });
        }
      };

      // Navigate down: scrolled to bottom, gesture started at bottom, there is a next page
      if (down && isBottom && st.gestureStartedAtEdge.bottom && i < PAGES.length - 1) {
        navigate("down", PAGES[i + 1]);
        return;
      }

      // Navigate up: scrolled to top, gesture started at top, there is a prev page
      if (!down && isTop && st.gestureStartedAtEdge.top && i > 0) {
        navigate("up", PAGES[i - 1]);
        return;
      }

      // Show progress hint if approaching edge
      const nextLabel = i < PAGES.length - 1 ? PAGE_LABELS[i + 1] : null;
      const prevLabel = i > 0 ? PAGE_LABELS[i - 1] : null;
      if (down && isBottom && nextLabel) {
        setBarLabel(`KEEP SCROLLING: ${nextLabel} ↓`);
        setBarVisible(true);
      } else if (!down && isTop && prevLabel) {
        setBarLabel(`↑ KEEP SCROLLING UP: ${prevLabel}`);
        setBarVisible(true);
      } else {
        setBarVisible(false);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, router, debug]);

  return (
    <>
      {/* Progress hint bar */}
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
          <span style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#6a6e90", whiteSpace: "nowrap",
          }}>
            {barLabel}
          </span>
          <div style={{ width: 120, height: 3, borderRadius: 999, background: "rgba(109,59,255,0.2)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "60%", background: "#6D3BFF", borderRadius: 999 }} />
          </div>
        </div>
      )}

      {/* Debug HUD (?debug=nav) */}
      {debug && hud && (
        <pre style={{
          position: "fixed", bottom: 8, left: 8, zIndex: 9999,
          background: "rgba(0,0,0,0.88)", color: "#0f0", padding: 10,
          fontSize: 11, borderRadius: 6, border: "1px solid #6D3BFF",
          fontFamily: "monospace", lineHeight: 1.6, pointerEvents: "none",
        }}>
          {JSON.stringify(hud, null, 2)}
        </pre>
      )}
    </>
  );
}
