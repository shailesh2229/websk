import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, PenTool, Gauge, Search, ArrowUpRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-black pb-32">
      {/* Intro Section - Bento Grid */}
      <div className="container mx-auto px-4 sm:px-8 max-w-[1400px] pt-32 pb-24 md:pb-40">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row mb-16 md:mb-24 gap-8">
          <div className="w-full md:w-[45%]">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-[11px] font-mono tracking-[0.2em] uppercase">
              ABOUT WEBSK
            </div>
          </div>
          <div className="w-full md:w-[55%]">
            <h1 className="text-white font-sans font-bold leading-[1.1] tracking-[-0.03em] text-[clamp(2.2rem,4.6vw,4rem)]">
              We don&apos;t just build websites. We build digital identities that help brands stand out, convert, and grow online.
            </h1>
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
              <p className="text-[22px] md:text-[26px] text-[#a1a1a1] leading-[1.5] mb-8 font-light">
                Websk blends creative design with clean development to craft modern, responsive experiences — from WordPress and custom front-end to e-commerce and SEO-ready builds.
              </p>
            </div>
            <div>
              <hr className="border-[#1f1f1f] mb-8" />
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="flex flex-col gap-3">
                  <PenTool className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Custom<br/>Design</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Gauge className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Fast<br/>Delivery</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Search className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">SEO<br/>Ready</span>
                </div>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-4 rounded-full border-[4px] border-white text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors w-fit">
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
                backgroundImage: `url(/about/featured.jpg), linear-gradient(135deg, #1f1f2e, #0a0a14), linear-gradient(to right, #111, #000)`,
                backgroundSize: 'cover, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            />
            <div className="absolute top-8 left-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-[0.2em] uppercase text-white">
                DIGITAL CRAFT
              </div>
            </div>
          </div>

          {/* Card 3: Polaroids */}
          <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-[36px] p-[32px] md:p-[44px] flex flex-col items-center justify-between min-h-[620px] relative overflow-hidden">
            <p className="text-center text-[#888] text-[17px] leading-relaxed max-w-[280px] relative z-10">
              Stories and moments from brands we&apos;ve helped grow with clearer design and stronger digital presence.
            </p>
            
            <div className="relative w-full flex-1 flex items-end justify-center pb-12 mt-12">
              {/* Left Polaroid */}
              <div className="absolute w-[160px] md:w-[180px] aspect-[3/4] bg-white p-2 pb-8 rounded-sm shadow-xl -rotate-8 -translate-x-12 md:-translate-x-16 translate-y-4">
                <div className="w-full h-full bg-[#111] overflow-hidden" style={{ backgroundImage: 'url(/about/moment-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              {/* Right Polaroid */}
              <div className="absolute w-[160px] md:w-[180px] aspect-[3/4] bg-white p-2 pb-8 rounded-sm shadow-xl rotate-8 translate-x-12 md:translate-x-16 translate-y-4">
                <div className="w-full h-full bg-[#111] overflow-hidden" style={{ backgroundImage: 'url(/about/moment-3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              {/* Center Polaroid (on top) */}
              <div className="absolute w-[170px] md:w-[190px] aspect-[3/4] bg-white p-2 pb-8 rounded-sm shadow-2xl rotate-0 z-10">
                <div className="w-full h-full bg-[#111] overflow-hidden" style={{ backgroundImage: 'url(/about/moment-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="container mx-auto px-4 max-w-5xl mb-24 md:mb-40">
        <h2 className="text-3xl md:text-5xl font-light font-sans tracking-tight mb-16 text-center">Why work with Websk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {[
            { title: "Modern Design", desc: "Aesthetics that align with today's visual standards." },
            { title: "Clean Development", desc: "Scalable, maintainable, and robust code architecture." },
            { title: "Mobile First", desc: "Flawless experiences across all devices and screen sizes." },
            { title: "Performance Focused", desc: "Optimized for speed to keep bounce rates minimal." },
            { title: "SEO Ready", desc: "Built with best practices to ensure high search visibility." },
            { title: "Business Focused", desc: "Strategic design aimed at increasing your conversions." },
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h3 className="text-xl font-medium text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="container mx-auto px-4 max-w-4xl mb-24 md:mb-40">
        <span className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-8 block text-center">
          How we work
        </span>
        <h2 className="text-3xl md:text-5xl font-light font-sans tracking-tight mb-16 text-center">Our Process</h2>
        
        <div className="space-y-12">
          {[
            { num: "01", title: "Discover", desc: "We start by understanding your brand, audience, and business goals to define the project scope." },
            { num: "02", title: "Define", desc: "Creating wireframes, mapping user journeys, and establishing a solid strategic foundation." },
            { num: "03", title: "Build", desc: "Translating designs into high-performance, accessible, and responsive code." },
            { num: "04", title: "Launch", desc: "Rigorous testing, optimization, and finally deploying your new digital identity." },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-6 md:gap-12 items-start group">
              <span className="text-2xl md:text-4xl font-mono text-muted-foreground/30 group-hover:text-primary transition-colors tabular-nums mt-1">
                {step.num}
              </span>
              <div className="flex-1 border-b border-[#22254a] pb-12">
                <h3 className="text-2xl md:text-3xl font-light font-sans mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-2xl">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-6xl font-light font-sans mb-12">Ready to build something great?</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link href="/contact" className={buttonVariants({ size: "lg", className: "rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-white/90" })}>
            Start a Project
          </Link>
          <Link href="/work" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 py-6 text-lg" })}>
            View Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
