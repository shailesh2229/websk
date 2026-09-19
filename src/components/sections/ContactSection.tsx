import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactSection() {
  return (
    <section className="pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-light font-sans mb-8">Let&apos;s talk.</h1>
            <p className="text-xl text-muted-foreground font-light mb-12 max-w-md">
              Interested in working together or just want to say hi? Drop a message below or email me directly at <a href={`mailto:${profile.email}`} className="text-foreground hover:underline decoration-white/30 underline-offset-4 transition-all">{profile.email}</a>.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Connect</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(profile.socials).map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-foreground font-light hover:text-primary transition-colors capitalize text-lg flex items-center group">
                      <span className="w-4 h-px bg-white/20 mr-4 group-hover:w-8 transition-all duration-300"></span>
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur border border-[#22254a] p-8 md:p-12">
            <form className="space-y-8" action={`mailto:${profile.email}`} method="post" encType="text/plain">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="bg-transparent border-white/10 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none h-12" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-transparent border-white/10 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none h-12" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="message" className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Message</Label>
                <Textarea id="message" name="message" placeholder="Tell me about your project..." required className="bg-transparent border-white/10 focus-visible:ring-1 focus-visible:ring-white/30 rounded-none min-h-[150px] resize-none" />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-none h-14 text-sm font-mono uppercase tracking-widest text-black bg-white hover:bg-white/90">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
