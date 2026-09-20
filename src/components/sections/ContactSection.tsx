"use client";

import { profile } from "@/data/profile";
import HoverFooter from "@/components/ui/hover-footer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="min-h-full flex flex-col pt-[calc(var(--nav-h,84px)+48px)]">
      {/* CTA from old About */}
      <div className="container mx-auto px-4 max-w-4xl text-center bg-[#0a0a0a] p-12 md:p-24 rounded-[36px] border border-[#1f1f1f] my-auto">
        <h2 className="text-4xl md:text-6xl font-bold font-sans tracking-tight mb-6">Ready to build something great?</h2>
        <p className="text-xl text-[#888] font-sans mb-12 max-w-2xl mx-auto">Have an idea, project or website that needs a better digital experience? Let&apos;s talk.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a 
            href={`mailto:${profile.email}?subject=New project enquiry`}
            className={buttonVariants({ size: "lg", className: "rounded-full px-8 py-6 text-lg font-bold bg-white text-black hover:bg-white/90 cursor-pointer" })}
          >
            Start a Project
          </a>
          <Link href="/work" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 py-6 text-lg font-bold border-white/20 hover:bg-white/10" })}>
            View Our Work
          </Link>
        </div>
      </div>

      <HoverFooter />
    </section>
  );
}
