"use client";

import { useEffect } from "react";
import { GlobeHero } from "@/components/GlobeHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash?.replace("#", "");
    if (!id) return;

    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <GlobeHero />
      <main>
        <section id="about" className="scroll-mt-[96px]">
          <AboutSection />
        </section>
        <section id="services" className="scroll-mt-[96px]">
          <ServicesSection />
        </section>
        <section id="work" className="scroll-mt-[96px]">
          <WorkSection />
        </section>
        <section id="contact" className="scroll-mt-[96px]">
          <ContactSection />
        </section>
      </main>
    </>
  );
}
