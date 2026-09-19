import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MinimalHero } from "@/components/hero/MinimalHero";
import { profile } from "@/data/profile";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-16">
        <MinimalHero 
          title="About Me" 
          subtitle="Passionate developer, designer, and digital creator."
          topText="WHO I AM"
          bottomText="PROFILE.LOADED"
        />

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-invert prose-lg max-w-none font-light leading-relaxed text-muted-foreground">
              <p className="text-2xl text-foreground mb-8">
                {profile.tagline}
              </p>
              <p>
                {profile.about}
              </p>
              <p>
                My approach to web development focuses on the intersection of aesthetics and functionality. I believe that a beautiful design is only as good as the underlying code that powers it.
              </p>
            </div>
            
            <div className="mt-20">
              <h3 className="text-2xl font-light font-sans mb-8">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-4">
                {profile.skills.map((skill, idx) => (
                  <Card key={idx} className="bg-zinc-950 border-white/5">
                    <CardContent className="p-4 flex items-center justify-center">
                      <span className="font-mono text-sm tracking-wider">{skill}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
