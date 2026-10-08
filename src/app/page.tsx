"use client";

import { useEffect } from "react";
import { EditorialHero } from "@/components/hero/EditorialHero";
import { IntroCurtain } from "@/components/IntroCurtain";
import { HomeIntro } from "@/components/sections/HomeIntro";
import { RecentWork } from "@/components/sections/RecentWork";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <IntroCurtain />
      <EditorialHero />
      <main className="bg-[#ffffff]">
        <HomeIntro />
        <RecentWork />
      </main>
      <Footer />
    </>
  );
}
