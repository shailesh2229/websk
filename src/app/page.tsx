import Link from "next/link";
import { GlobeHero } from "@/components/hero/GlobeHero";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Paintbrush, MonitorSmartphone, Cuboid } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Web Design": <Paintbrush className="w-8 h-8 text-primary" />,
  "Frontend Development": <Code className="w-8 h-8 text-primary" />,
  "Full-stack Next.js Applications": <MonitorSmartphone className="w-8 h-8 text-primary" />,
  "3D Web Experiences": <Cuboid className="w-8 h-8 text-primary" />,
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen">
        <GlobeHero />

        {/* Short About Section */}
        <section className="py-24 border-b border-[#22254a] bg-transparent">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-8 font-sans">
              Crafting digital experiences with precision and passion.
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              {profile.about}
            </p>
            <div className="mt-12">
              <Link href="/about" className={buttonVariants({ variant: "outline", className: "rounded-full" })}>
                More About Me
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 border-b border-[#22254a] bg-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-light font-sans mb-4">Core Capabilities</h2>
                <p className="text-muted-foreground font-light max-w-xl">
                  Leveraging modern technologies to build scalable, beautiful, and highly functional web applications.
                </p>
              </div>
              <Link href="/services" className={buttonVariants({ variant: "ghost", className: "gap-2" })}>
                All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.services.map((service, idx) => (
                <Card key={idx} className="bg-white/[0.03] backdrop-blur border-[#22254a] hover:border-[#6D3BFF] transition-colors">
                  <CardHeader>
                    <div className="mb-4">
                      {iconMap[service] || <Code className="w-8 h-8 text-primary" />}
                    </div>
                    <CardTitle className="font-light text-xl">{service}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Work Section */}
        <section className="py-24 border-b border-[#22254a] bg-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-light font-sans mb-4">Selected Work</h2>
                <p className="text-muted-foreground font-light max-w-xl">
                  A glimpse into some of the recent projects I&apos;ve brought to life.
                </p>
              </div>
              <Link href="/work" className={buttonVariants({ variant: "ghost", className: "gap-2" })}>
                View All Work <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project, idx) => (
                <Link href={project.link} key={idx} target="_blank" className="group block">
                  <Card className="overflow-hidden border-[#22254a] bg-white/[0.03] backdrop-blur group-hover:border-[#6D3BFF] transition-colors">
                    <div className="aspect-video relative overflow-hidden bg-transparent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-light mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{project.category} &mdash; {project.year}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1 duration-300" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Process & CTA Section */}
        <section className="py-32 bg-transparent relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 z-0"></div>
          <div className="container mx-auto px-4 relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-light font-sans mb-6">Let&apos;s build something extraordinary.</h2>
            <p className="text-xl text-muted-foreground font-light mb-12">
              Have a project in mind? I&apos;m currently available for new opportunities.
            </p>
            <Link href="/contact" className={buttonVariants({ size: "lg", className: "rounded-full px-8 py-6 text-lg" })}>
              Get In Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
