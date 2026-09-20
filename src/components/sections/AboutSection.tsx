import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, PenTool, Gauge, Search, ArrowUpRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-transparent pb-32 pt-[108px]">
      {/* Intro Section - Bento Grid */}
      <div className="container mx-auto px-4 sm:px-8 max-w-[1400px]">
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
              <p className="text-[22px] md:text-[26px] text-[#a1a1a1] leading-[1.5] mb-8 font-light font-sans tracking-tight">
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
            <p className="text-center text-[#888] text-[17px] leading-relaxed max-w-[280px] relative z-10 font-sans tracking-tight">
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


    </section>
  );
}
