/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    // We want the hero text to be white at the top, 
    // and only switch when we scroll down past the hero (or just a bit).
    // Let's switch at window.innerHeight - 80
    const handleScrollHero = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
    };

    window.addEventListener("scroll", handleScrollHero);
    
    // Check initial
    handleScrollHero();
    
    return () => window.removeEventListener("scroll", handleScrollHero);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${inter.className} ${
          scrolled 
            ? "bg-[rgba(244,243,239,0.8)] backdrop-blur-md border-b border-black/10 py-2" 
            : "bg-transparent border-b border-transparent"
        }`}
        style={!scrolled ? { paddingTop: "2.4vh", paddingLeft: "3vw", paddingRight: "3vw" } : { paddingLeft: "3vw", paddingRight: "3vw" }}
      >
        <div className="w-full flex items-center justify-between">
          <a href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/websk-signature-nav.png"
              alt="Websk"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "invert opacity-90" : "drop-shadow-sm"
              }`}
              style={{ height: "clamp(26px, 3vw, 52px)" }}
            />
          </a>

          <div className="flex items-center">
            <nav className="hidden md:flex" style={{ gap: "2.2vw" }}>
              {links.map((link) => {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`transition-all duration-300 hover:opacity-60 font-normal ${
                      scrolled ? "text-[#111]" : "text-[#ffffff]"
                    }`}
                    style={{ fontSize: "clamp(11px, 0.85vw, 14px)", color: scrolled ? "#111" : "#ffffff" }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden ml-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 transition-colors ${scrolled ? "text-[#111]" : "text-[#ffffff]"}`}
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
        <div className={`fixed inset-0 z-40 bg-[#F4F3EF] flex flex-col pt-24 px-6 md:hidden ${inter.className}`}>
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-3xl text-[#111] font-normal"
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

