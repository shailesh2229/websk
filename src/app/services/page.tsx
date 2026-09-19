import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MinimalHero } from "@/components/hero/MinimalHero";
import { profile } from "@/data/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-16">
        <MinimalHero 
          title="Services" 
          subtitle="Comprehensive solutions for your digital needs."
          topText="WHAT I DO"
          bottomText="SERVICES.ONLINE"
        />

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.services.map((service, idx) => (
                <Card key={idx} className="bg-zinc-950 border-white/5 hover:border-white/20 transition-colors group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="font-light text-2xl mb-4 group-hover:text-primary transition-colors">{service}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-light mb-8">
                      Delivering high-quality, scalable, and responsive {service.toLowerCase()} tailored to your specific requirements and goals.
                    </p>
                    <div className="flex items-center text-sm font-mono tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
