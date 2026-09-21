"use client";

import { GlobeHero } from "@/components/GlobeHero";

export default function Home() {
  return (
    <>
      {/* GlobeHero: fixed full-viewport, handles its own scroll/pinch/touch */}
      <GlobeHero />
      {/* A min-height div so the page has scroll height for PageNavigator's atBottom check */}
      {/* But actually Home never triggers page-nav — GlobeHero handles all scroll input */}
      {/* We give the page a full viewport height so layout doesn't collapse */}
      <div style={{ minHeight: "100dvh" }} aria-hidden="true" />
    </>
  );
}
