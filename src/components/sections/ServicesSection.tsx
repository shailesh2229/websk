import Link from "next/link";
import { LayoutTemplate, Code2, Palette, RefreshCw, ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Website Design",
    description: "Clean, modern, responsive layouts tailored to your brand with intentional typography and spacing.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Website Development",
    description: "Hand-crafted front-end development with performance, accessibility, and scalability in mind.",
  },
  {
    number: "05",
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that balances aesthetics with clarity, usability, and business goals.",
  },
  {
    number: "06",
    icon: RefreshCw,
    title: "Website Redesign",
    description: "Transform outdated websites into modern, high-performing digital experiences.",
  }
];

export function ServicesSection() {
  return (
    <section className="bg-black py-24 md:py-32 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-[#8a8a8a] mb-6 block">
            Services
          </span>
          <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] text-white uppercase font-sans">
            What We Do
          </h2>
        </div>

        <div className="stack grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="stack-item flex">
                <Link 
                  href="/services" 
                  className="service-card w-full flex flex-col justify-between bg-[#0a0a0a] border border-[#222] rounded-[32px] p-[28px] md:p-[48px] hover:border-[#6D3BFF] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D3BFF] focus-visible:ring-offset-4 focus-visible:ring-offset-black group"
                >
                  <div className="flex justify-between items-start mb-16 md:mb-24">
                    <span className="font-mono text-sm tracking-widest text-[#8a8a8a] tabular-nums pt-1">
                      {service.number}
                    </span>
                    <Icon className="w-9 h-9 text-white" strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h3 className="text-[24px] md:text-[28px] font-medium tracking-tight text-white font-sans">
                      {service.title}
                    </h3>
                    <p className="text-[18px] md:text-[20px] leading-[1.6] text-[#8a8a8a] max-w-md font-serif mb-8 md:mb-12">
                      {service.description}
                    </p>
                    <ArrowUpRight className="w-6 h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
