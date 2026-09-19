import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-[84px]">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
