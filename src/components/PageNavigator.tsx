"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { homeEntry } from "@/lib/home-entry";
import { navDirection } from "@/lib/nav-direction";

const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const GESTURE_GAP = 200;
const EDGE_REST = 150;
const OUT_MS = 650;
const IN_MS = 900;
const QUIET = 250;

export function PageNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const first = useRef(true);
  const s = useRef({
    lastWheel: 0, locked: false, busy: false,
    edgeSince: { top: 0, bottom: 0 },
    startedEdge: { top: false, bottom: false },
  });

  const root = () => document.documentElement;
  const sc = () => (document.scrollingElement || root()) as HTMLElement;
  const atTop = () => sc().scrollTop <= 1;
  const atBottom = () => sc().scrollTop + window.innerHeight >= sc().scrollHeight - 2;

  // Route change: scroll to top, run in animation, then unlock when wheel quiet
  useEffect(() => {
    const st = s.current;
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    root().dataset.nav = "in-start";
    void root().offsetHeight; // force reflow
    requestAnimationFrame(() => { root().dataset.nav = "in"; });

    const t = setTimeout(() => {
      delete root().dataset.nav;
      st.busy = false;
    }, IN_MS);

    const q = setInterval(() => {
      const now = performance.now();
      if (!st.busy && now - st.lastWheel > QUIET) {
        st.locked = false;
        st.edgeSince = { top: now, bottom: now };
        st.startedEdge = { top: false, bottom: false };
        clearInterval(q);
      }
    }, 50);

    return () => { clearTimeout(t); clearInterval(q); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const st = s.current;

    const onScroll = () => {
      const now = performance.now();
      if (!atTop()) st.edgeSince.top = now;
      if (!atBottom()) st.edgeSince.bottom = now;
    };

    const go = (dir: "up" | "down", target: string) => {
      st.locked = true;
      st.busy = true;

      // Set direction for homeEntry fly-out and template enter animation
      if (dir === "up") {
        navDirection.set("prev");
        if (pathname === "/about") homeEntry.setFromAbout(true);
      } else {
        navDirection.set("next");
      }

      root().dataset.dir = dir;
      root().dataset.nav = "out";
      setTimeout(() => router.push(target, { scroll: false }), OUT_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // leave pinch to GlobeHero
      const now = performance.now();
      const fresh = now - st.lastWheel > GESTURE_GAP;
      st.lastWheel = now;

      if (st.locked) { e.preventDefault(); return; }

      if (fresh) {
        st.startedEdge.top    = atTop()    && now - st.edgeSince.top    >= EDGE_REST;
        st.startedEdge.bottom = atBottom() && now - st.edgeSince.bottom >= EDGE_REST;
      }

      const i = PAGES.indexOf(pathname);
      const down = e.deltaY > 0;

      if (down && atBottom() && st.startedEdge.bottom && i < PAGES.length - 1) {
        e.preventDefault(); go("down", PAGES[i + 1]);
      } else if (!down && atTop() && st.startedEdge.top && i > 0) {
        e.preventDefault(); go("up", PAGES[i - 1]);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, router]);

  return null;
}
