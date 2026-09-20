"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { navDirection } from "@/lib/nav-direction";

// Page transition: zoom-in when going next, zoom-out when going prev
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dir = navDirection.get();

    if (reducedMotion || dir === "none") {
      // Simple fade
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "none";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 200ms ease";
        el.style.opacity = "1";
      });
      return;
    }

    // Enter animation based on direction
    // next: new page enters from scale 0.94, opacity 0
    // prev: new page enters from scale 1.08, opacity 0
    const fromScale = dir === "next" ? 0.94 : 1.08;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `scale(${fromScale})`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
          "opacity 500ms cubic-bezier(0.65,0,0.35,1), transform 500ms cubic-bezier(0.65,0,0.35,1)";
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
        navDirection.set("none");
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={ref} id="page-content" style={{ willChange: "opacity, transform", overflowX: "clip" }}>
      {children}
    </div>
  );
}
