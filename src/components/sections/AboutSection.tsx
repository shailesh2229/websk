import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="bg-transparent pb-32">
      {/* Intro Section */}
      <div className="container mx-auto px-4 max-w-5xl pt-24 md:pt-32 mb-20 md:mb-32">
        <span className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-8 block">
          About Websk
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light font-sans leading-[1.1] mb-10 tracking-tight">
          We don&apos;t just build websites. We build digital identities that help brands stand out, convert, and grow online.
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-16">
          <div className="flex flex-wrap gap-3">
            {["Custom Design", "Fast Delivery", "SEO Ready"].map((tag) => (
              <span key={tag} className="px-5 py-2.5 rounded-full border border-[#22254a] bg-white/[0.02] text-sm font-mono text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <Link href="/contact" className={buttonVariants({ variant: "default", size: "lg", className: "rounded-full px-8 bg-white text-black hover:bg-white/90" })}>
            Contact Us
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 max-w-7xl mb-24 md:mb-40">
        <div 
          className="w-full aspect-video md:aspect-[16/8] rounded-[32px] overflow-hidden bg-[#0a0a0a]"
          style={{
            backgroundImage: `url(/about/featured.jpg), linear-gradient(135deg, #111, #000)`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat'
          }}
        />
      </div>

      {/* Digital Craft Gallery */}
      <div className="container mx-auto px-4 max-w-7xl mb-24 md:mb-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-3xl md:text-5xl font-light font-sans tracking-tight">Digital Craft</h2>
          <p className="text-muted-foreground font-light max-w-md text-lg">
            A glimpse into our meticulous design and development process.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div 
              key={num}
              className="w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-[#0a0a0a]"
              style={{
                backgroundImage: `url(/about/moment-${num}.jpg), linear-gradient(135deg, #1a1a1a, #050505)`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat'
              }}
            />
          ))}
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
