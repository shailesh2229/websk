"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { homeEntry } from "@/lib/home-entry";
import { navDirection } from "@/lib/nav-direction";

const PAGES = ["/", "/about", "/services", "/work", "/contact"];
const GESTURE_GAP = 200;
const EDGE_REST = 150;
const OUT_MS = 800;
const IN_MS = 1300;
const QUIET = 250;
const MAX_LOCK_AFTER_IN = 300;

export function PageNavigator() {
  const pathname = usePathname();
  const router = useRouter();
  const prevPath = useRef(pathname);
  const [debug, setDebug] = useState(false);
  const [hud, setHud] = useState<Record<string, unknown> | null>(null);

  const s = useRef({
    lastWheel: 0,
    locked: false,
    entering: false,
    edgeSince: { top: 0, bottom: 0 },
    startedEdge: { top: false, bottom: false },
  });

  const root = () => document.documentElement;
  const sc = () => (document.scrollingElement || root()) as HTMLElement;
  const atTop = () => sc().scrollTop <= 1;
  const atBottom = () => sc().scrollTop + window.innerHeight >= sc().scrollHeight - 2;

  useEffect(() => {
    setDebug(new URLSearchParams(location.search).get("debug") === "nav");
  }, []);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    const st = s.current;
    const el = root();

    st.locked = true;
    st.entering = true;

    const d = navDirection.get();
    el.dataset.dir = d === "prev" ? "up" : "down";
    navDirection.set("none");

    window.scrollTo(0, 0);
    el.dataset.nav = "in-start";
    void el.offsetHeight;
    const raf = requestAnimationFrame(() => { el.dataset.nav = "in"; });

    const started = performance.now();
    const done = setTimeout(() => {
      delete el.dataset.nav;
      st.entering = false;
    }, IN_MS);

    const q = setInterval(() => {
      if (st.entering) return;
      const now = performance.now();
      if (now - st.lastWheel > QUIET || now - started > IN_MS + MAX_LOCK_AFTER_IN) {
        st.locked = false;
        st.edgeSince = { top: now, bottom: now };
        st.startedEdge = { top: false, bottom: false };
        clearInterval(q);
      }
    }, 50);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
      clearInterval(q);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const st = s.current;

    const onScroll = () => {
      const now = performance.now();
      if (!atTop()) st.edgeSince.top = now;
      if (!atBottom()) st.edgeSince.bottom = now;
      if (st.entering && window.scrollY !== 0) window.scrollTo(0, 0);
    };

    const go = (dir: "up" | "down", target: string) => {
      st.locked = true;
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
      if (e.ctrlKey) return;
      const now = performance.now();
      const fresh = now - st.lastWheel > GESTURE_GAP;
      st.lastWheel = now;

      if (st.locked) { e.preventDefault(); return; }

      const i = PAGES.indexOf(pathname);
      if (i <= 0) return; // Home (i===0) owned by GlobeHero; unknown routes (i===-1) never navigate

      if (fresh) {
        st.startedEdge.top    = atTop()    && now - st.edgeSince.top    >= EDGE_REST;
        st.startedEdge.bottom = atBottom() && now - st.edgeSince.bottom >= EDGE_REST;
      }

      const down = e.deltaY > 0;

      if (debug) {
        setHud({
          page: pathname, y: Math.round(sc().scrollTop), h: sc().scrollHeight,
          top: atTop(), bottom: atBottom(),
          startedTop: st.startedEdge.top, startedBottom: st.startedEdge.bottom,
          dy: Math.round(e.deltaY), fresh, locked: st.locked,
        });
      }

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
  }, [pathname, router, debug]);

  if (!debug || !hud) return null;
  return (
    <pre
      style={{
        position: "fixed", bottom: 8, left: 8, zIndex: 9999, margin: 0,
        background: "#000c", color: "#0f0", padding: 8, fontSize: 11, pointerEvents: "none",
      }}
    >
      {JSON.stringify(hud, null, 1)}
    </pre>
  );
}
