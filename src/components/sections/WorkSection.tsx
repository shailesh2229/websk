import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HoverFooter from "@/components/ui/hover-footer";

export function WorkSection() {
  return (
    <section className="bg-transparent pt-[108px] pb-0 w-full">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">
            Portfolio
          </span>
          <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white uppercase font-sans">
            Selected Work
          </h2>
        </div>

        {/* Work Items Grid */}
        <div className="flex flex-col gap-12 md:gap-24 max-w-5xl mx-auto mb-32">
          {/* Project 1 */}
          <Link href="/work/shivkrupa" className="group block w-full">
            <div className="relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-[#111] border border-[#222] mb-6 md:mb-8 transition-colors duration-500 group-hover:border-[#6D3BFF]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url(/proj1.png)' }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating Action Button */}
              <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-white/10 backdrop-blur-md w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border border-white/20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
              <div>
                <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-white font-sans mb-3 md:mb-4">
                  Shivkrupa Enterprise
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {["Web Design", "Development", "Business"].map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-full border border-white/10 text-[11px] md:text-xs font-mono tracking-widest text-[#a1a1a1] uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[#a1a1a1] font-mono text-sm tracking-widest uppercase">
                2026
              </div>
            </div>
          </Link>
        </div>

        {/* Process */}
        <div className="max-w-4xl mx-auto mb-32">
          <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block text-center">
            Process
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold font-sans tracking-tight mb-6 text-center uppercase">HOW WE WORK</h2>
          <p className="text-center text-[#888] text-lg md:text-xl font-sans mb-16 max-w-2xl mx-auto">
            Four clear steps from first conversation to launch — focused on clarity, speed, and results.
          </p>
          
          <div className="space-y-12 mt-16">
            {[
              { num: "01", title: "DISCOVER", desc: "We dig into your business, audience, and goals before anything is designed." },
              { num: "02", title: "DEFINE", desc: "Strategy, structure, and visual direction locked in with clear priorities." },
              { num: "03", title: "BUILD", desc: "Design and development come together into one polished experience." },
              { num: "04", title: "LAUNCH", desc: "Rigorous testing, fine-tuning, and a confident go-live." },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 md:gap-12 items-start group">
                <span className="text-2xl md:text-4xl font-mono text-muted-foreground/30 group-hover:text-white transition-colors tabular-nums mt-1">
                  {step.num}
                </span>
                <div className="flex-1 border-b border-[#22254a] pb-12">
                  <h3 className="text-2xl md:text-3xl font-bold font-sans tracking-tight mb-4">{step.title}</h3>
                  <p className="text-muted-foreground font-sans text-lg leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Work With Us */}
        <div className="max-w-5xl mx-auto pb-16">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">
              Why Us
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold font-sans tracking-tight mb-6">Why work with Websk?</h2>
            <p className="text-[#888] text-lg md:text-xl font-sans max-w-2xl">
              Design, development, and strategy in one place — so your website looks sharp, loads fast, and actually works for the business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {[
              { num: "01", title: "Modern Design", desc: "Clean visuals and layouts that feel current, clear, and on-brand." },
              { num: "02", title: "Clean Development", desc: "Structured, maintainable code built for speed and long-term growth." },
              { num: "03", title: "Mobile First", desc: "Experiences designed to feel sharp and effortless on every screen." },
              { num: "04", title: "Performance Focused", desc: "Lightweight builds that load fast and keep users moving." },
              { num: "05", title: "SEO Ready", desc: "Technical foundations that help your site get found and rank better." },
              { num: "06", title: "Business Focused", desc: "Every decision tied to clarity, trust, and real conversion goals." },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-3 bg-[#0a0a0a] p-8 rounded-2xl border border-[#1f1f1f]">
                <span className="text-sm font-mono text-muted-foreground tabular-nums mb-2 block">{feature.num}</span>
                <h3 className="text-xl font-bold font-sans tracking-tight text-white">{feature.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="w-full bg-[#030303] relative border-t border-white/5 py-24 md:py-32">
        {/* Grid background */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '66px 66px'
        }} />
        
        <div className="container mx-auto px-4 max-w-[1400px] relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-32">
          {/* Left Column */}
          <div className="flex-1 max-w-2xl">
            <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">
              TECHNOLOGY
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-bold font-sans tracking-tight text-white uppercase mb-8">
              TOOLS WE<br />WORK WITH
            </h2>
            <p className="text-[#888] text-[20px] md:text-[28px] font-sans leading-[1.4] mb-12">
              Modern technologies for fast, scalable, and maintainable digital products.
            </p>
            <hr className="w-[130px] border-white/20 mb-8" />
            <p className="text-[#666] text-sm md:text-base font-sans max-w-sm">
              From first wireframe to production deploy — the stack stays lean and built for long-term growth.
            </p>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-12 lg:pt-12">
            {/* Group 1 */}
            <div>
              <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-6">
                <span className="text-[11px] font-mono tracking-[0.3em] text-[#666] uppercase">01&nbsp;&nbsp;FRONTEND</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4 items-baseline font-sans font-bold uppercase tracking-tight">
                <span className="text-[2rem] md:text-[3rem] text-white">NEXT.JS</span>
                <span className="text-[2rem] md:text-[3rem] text-white">REACT</span>
                <span className="text-xl md:text-2xl text-[#888]">JAVASCRIPT</span>
                <span className="text-xl md:text-2xl text-[#888]">TAILWIND CSS</span>
                <div className="w-full h-0" />
                <span className="text-lg md:text-xl text-[#555]">HTML</span>
                <span className="text-lg md:text-xl text-[#555]">CSS</span>
              </div>
            </div>
            
            {/* Group 2 */}
            <div>
              <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-6">
                <span className="text-[11px] font-mono tracking-[0.3em] text-[#666] uppercase">02&nbsp;&nbsp;PLATFORM</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4 items-baseline font-sans font-bold uppercase tracking-tight">
                <span className="text-[2rem] md:text-[3rem] text-white">WORDPRESS</span>
                <span className="text-xl md:text-2xl text-[#888]">WOOCOMMERCE</span>
              </div>
            </div>

            {/* Group 3 */}
            <div>
              <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-6">
                <span className="text-[11px] font-mono tracking-[0.3em] text-[#666] uppercase">03&nbsp;&nbsp;WORKFLOW</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4 items-baseline font-sans font-bold uppercase tracking-tight">
                <span className="text-2xl md:text-[2rem] text-[#aaa]">FIGMA</span>
                <span className="text-2xl md:text-[2rem] text-[#aaa]">GIT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Running Lines */}
      <div className="w-full bg-[#000] border-t border-[#222]">
        <div className="w-full overflow-hidden flex border-b border-[#222] py-5">
          <div className="flex shrink-0 whitespace-nowrap animate-marquee text-[#888] marquee-track">
            {[...["HTML", "CSS", "GIT", "FIGMA", "NEXT.JS", "REACT", "WORDPRESS", "JAVASCRIPT", "TAILWIND", "WOOCOMMERCE"], ...["HTML", "CSS", "GIT", "FIGMA", "NEXT.JS", "REACT", "WORDPRESS", "JAVASCRIPT", "TAILWIND", "WOOCOMMERCE"]].map((item, idx) => (
              <div key={idx} className="flex items-center px-6">
                <span className="text-[11px] md:text-xs font-mono tracking-[0.25em] uppercase">{item}</span>
                <span className="w-1 h-1 rounded-full bg-white/20 ml-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-hidden flex border-b border-[#222] py-5">
          <div className="flex shrink-0 whitespace-nowrap animate-marquee-reverse text-[#444] marquee-track">
            {[...["REACT", "NEXT.JS", "FIGMA", "GIT", "CSS", "HTML", "WOOCOMMERCE", "TAILWIND", "JAVASCRIPT", "WORDPRESS"], ...["REACT", "NEXT.JS", "FIGMA", "GIT", "CSS", "HTML", "WOOCOMMERCE", "TAILWIND", "JAVASCRIPT", "WORDPRESS"]].map((item, idx) => (
              <div key={idx} className="flex items-center px-6">
                <span className="text-[11px] md:text-xs font-mono tracking-[0.25em] uppercase">{item}</span>
                <span className="w-1 h-1 rounded-full bg-white/20 ml-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
