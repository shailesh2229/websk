import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-[84px]">
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
}
