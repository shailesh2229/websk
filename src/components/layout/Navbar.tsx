/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Intersection observer for the hero section
    const heroEl = document.querySelector('section.bg-\\[\\#8E9193\\]') || document.querySelector('.hero-role')?.closest('section');
    
    if (!heroEl) {
      // fallback
      const handleScroll = () => {
        setScrolled(window.scrollY > window.innerHeight - 80);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If hero is intersecting (visible), we are NOT scrolled past it
        // We set scrolled to true when hero is completely out of view (isIntersecting = false)
        // Or actually, we want to trigger as soon as it's mostly out of view
        setScrolled(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const id = href === "/" ? null : href.replace("/", "").replace("#", "");

    if (pathname !== "/") {
      router.push(id ? `/#${id}` : "/");
      return;
    }

    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[rgba(244,243,239,0.8)] backdrop-blur-md border-b border-black/10 py-2" 
            : "bg-transparent py-4 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/websk-signature-nav.png"
              alt="Websk"
              width="145"
              height="56"
              className={`h-[28px] md:h-[32px] w-auto object-contain transition-all duration-300 ${
                scrolled ? "invert opacity-90" : "drop-shadow-sm"
              }`}
            />
          </a>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              {links.map((link) => {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-[14px] font-sans transition-all duration-300 hover:opacity-60 ${
                      scrolled ? "text-[#111] font-medium" : "text-white font-normal"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 transition-colors ${scrolled ? "text-[#111]" : "text-white"}`}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F4F3EF] flex flex-col pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-3xl font-sans text-[#111] font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

