import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function WorkSection() {
  return (
    <section className="bg-black pb-32">
      <div className="container mx-auto px-4 sm:px-8 max-w-[1400px] pt-32 pb-24 md:pb-40">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-[11px] font-mono tracking-[0.2em] uppercase mb-8">
          Portfolio
        </div>
        <h1 className="text-white font-sans font-bold leading-[1.1] tracking-tight text-[clamp(3rem,8vw,6.5rem)] mb-20 uppercase">
          SELECTED WORK
        </h1>

        <div className="flex flex-col gap-32">
          {projects.map((project, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-12 md:gap-16 group">
              <div className="w-full md:w-[60%]">
                <Link href={project.link} target="_blank" className="block aspect-video md:aspect-[4/3] rounded-[36px] overflow-hidden bg-[#111] relative border border-[#1f1f1f]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                </Link>
              </div>
              <div className="w-full md:w-[40%] flex flex-col justify-center">
                <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-4 block">
                  Project {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-4xl md:text-5xl font-light font-sans mb-4">{project.title}</h3>
                <p className="text-sm font-mono tracking-widest uppercase text-[#888] mb-8">{project.category} &mdash; {project.year}</p>
                <p className="text-[20px] text-[#a1a1a1] font-light leading-[1.6] mb-10 max-w-md">
                  {project.description}
                </p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 rounded-full border-[4px] border-white text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors w-fit">
                  VIEW PROJECT
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 flex justify-center">
          <Link href="/work" className="inline-flex items-center gap-2 px-8 py-5 rounded-full border-[4px] border-[#222] bg-[#0a0a0a] text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-colors">
            VIEW ALL WORK
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
