import Link from "next/link";
import { Sparkles, PenTool, Gauge, Search, ArrowUpRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-transparent pb-32 pt-[108px]">
      {/* Intro Section - Bento Grid */}
      <div className="container mx-auto px-4 sm:px-8 max-w-[1400px]">
        {/* Row 1 — Personal Profile Intro */}
        <div className="flex flex-col md:flex-row mb-16 md:mb-24 gap-8 md:gap-12 items-stretch">
          {/* Left: Portrait photo card */}
          <div className="w-full md:w-[38%] relative">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[36px] overflow-hidden w-full aspect-[3/4] md:aspect-auto md:h-full min-h-[340px] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sk.jpg"
                alt="Shailesh Chaudhary"
                className="w-full h-full object-cover object-top"
              />
              {/* Purple gradient overlay at bottom for pill readability */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-[36px]" />
            </div>

            {/* Status pill — overlaps the bottom of the photo card */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
              Open to opportunities
            </div>
          </div>

          {/* Right: Bio content */}
          <div className="w-full md:w-[62%] flex flex-col justify-center gap-6">
            {/* Mono label pill */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-[11px] font-mono tracking-[0.2em] uppercase w-fit">
              // DIGITAL BUILDER
            </div>

            {/* Heading */}
            <h1 className="text-white font-sans font-bold leading-[1.1] tracking-[-0.03em] text-[clamp(2.2rem,4.6vw,4rem)]">
              Hi, I&apos;m Shailesh.
            </h1>

            {/* Body */}
            <p className="text-[#a1a1a1] font-sans text-[clamp(15px,1.15vw,18px)] leading-[1.75] max-w-[560px]">
              I build modern websites and digital experiences that are fast,
              responsive, and built around real business needs. From clean
              interfaces to full-stack functionality, I turn ideas into products
              that are ready to ship.
            </p>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2">
              {["Full-Stack", "AI-Accelerated Dev", "Fast Shipping"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono tracking-widest text-[#a1a1a1] uppercase"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border-[4px] border-white text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
              >
                View My Work
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[28px]">
          {/* Card 1: Text */}
          <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[36px] p-[32px] md:p-[44px] flex flex-col justify-between min-h-[620px]">
            <div>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-black mb-8">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-[22px] md:text-[26px] text-[#a1a1a1] leading-[1.5] mb-8 font-light font-sans tracking-tight">
                Websk blends creative design with clean development to craft
                modern, responsive experiences — from WordPress and custom
                front-end to e-commerce and SEO-ready builds.
              </p>
            </div>
            <div>
              <hr className="border-[#1f1f1f] mb-8" />
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="flex flex-col gap-3">
                  <PenTool className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                    Custom
                    <br />
                    Design
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Gauge className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                    Fast
                    <br />
                    Delivery
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Search className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                    SEO
                    <br />
                    Ready
                  </span>
                </div>
              </div>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border-[4px] border-white text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors w-fit"
              >
                CONTACT US
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Image */}
          <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[36px] min-h-[620px] relative overflow-hidden group">
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(/about/featured_new.jpg), linear-gradient(135deg, #1f1f2e, #0a0a14), linear-gradient(to right, #111, #000)`,
                backgroundSize: "cover, cover, cover",
                backgroundPosition: "center, center, center",
                backgroundRepeat: "no-repeat, no-repeat, no-repeat",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            <div className="absolute top-8 left-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-[0.2em] uppercase text-white">
                DIGITAL CRAFT
              </div>
            </div>
          </div>

          {/* Card 3: Brand showcase image */}
          <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[36px] p-[32px] md:p-[44px] flex flex-col items-center justify-between min-h-[620px] relative overflow-hidden">
            <p className="text-center text-[#888] text-[17px] leading-relaxed max-w-[280px] relative z-10 font-sans tracking-tight">
              Stories and moments from brands we&apos;ve helped grow with
              clearer design and stronger digital presence.
            </p>

            <div className="relative w-full flex-1 flex mt-10 rounded-[20px] overflow-hidden border border-white/5 shadow-2xl">
              <div
                className="w-full h-full absolute inset-0 bg-[#111]"
                style={{
                  backgroundImage: "url(/about/brand_showcase.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
