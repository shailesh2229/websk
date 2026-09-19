import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function WorkSection() {
  return (
    <section className="bg-transparent py-24 md:py-32 w-full">
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
        <div className="flex flex-col gap-12 md:gap-24 max-w-5xl mx-auto">
          {/* Project 1 */}
          <Link href="/work/shivkrupa" className="group block w-full">
            <div className="relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-[#111] border border-[#222] mb-6 md:mb-8 transition-colors duration-500 group-hover:border-[#6D3BFF]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url(/work/shivkrupa-preview.jpg)' }}
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
      </div>
    </section>
  );
}
