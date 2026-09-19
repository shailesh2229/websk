import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MinimalHero } from "@/components/hero/MinimalHero";
import { projects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Work() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-16">
        <MinimalHero 
          title="Selected Work" 
          subtitle="A showcase of my recent projects and experiments."
          topText="PORTFOLIO"
          bottomText="PROJECTS.ACTIVE"
        />

        <section className="py-24 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <Link href={project.link} key={idx} target="_blank" className="group block">
                  <Card className="overflow-hidden border-[#22254a] bg-white/[0.03] backdrop-blur group-hover:border-[#6D3BFF] transition-colors h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-transparent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <div className="mb-8">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-light">{project.title}</h3>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors -rotate-45" />
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mb-4">{project.category} &mdash; {project.year}</p>
                        <p className="text-muted-foreground font-light text-sm line-clamp-3">{project.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
