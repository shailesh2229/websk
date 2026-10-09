"use client";

const SLIDES = [
  {
    i: 1,
    num: "01",
    title: "Discover",
    lead: "We dig into your business, audience, and goals before anything is designed.",
    bullets: [
      "We learn how your business really works",
      "What you need, not what a template gives",
      "A clear brief before any design starts",
    ],
  },
  {
    i: 2,
    num: "02",
    title: "Define",
    lead: "Strategy, structure, and visual direction locked in with clear priorities.",
    bullets: [
      "Site map, pages and content plan",
      "Visual direction and style agreed",
      "Scope, timeline and priorities in writing",
    ],
  },
  {
    i: 3,
    num: "03",
    title: "Build",
    lead: "Design and development come together into one polished experience.",
    bullets: [
      "Custom design and clean code, one team",
      "Fast, responsive, SEO-ready pages",
      "Regular previews so nothing surprises you",
    ],
  },
  {
    i: 4,
    num: "04",
    title: "Launch",
    lead: "Rigorous testing, fine-tuning, and a confident go-live.",
    bullets: [
      "Tested on every device and browser",
      "Speed and small details fine-tuned",
      "Live with support after launch",
    ],
  },
];

export function ProcessSlides() {
  return (
    <section
      className="w-full py-24 md:py-32 bg-transparent"
      aria-label="How we work"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-20 text-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block font-medium">
            Process
          </span>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-normal tracking-[-0.04em] leading-[1] text-foreground">
            How we work
          </h2>
        </div>
        <div className="flex flex-col gap-12">
          {SLIDES.map((s) => (
            <div key={s.i} className="border-t border-border pt-12">
              <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                <span className="text-lg md:text-xl tracking-wide text-muted-foreground shrink-0 w-12 pt-1 font-light">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-2xl md:text-4xl font-normal tracking-[-0.03em] text-foreground mb-4">
                    {s.title}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl font-light">
                    {s.lead}
                  </p>
                  <ul className="space-y-4">
                    {s.bullets.map((b, k) => (
                      <li
                        key={k}
                        className="text-foreground text-base md:text-lg pl-8 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground font-light"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
