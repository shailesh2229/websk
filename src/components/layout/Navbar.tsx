/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const mainLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLightTheme = pathname === "/work" || pathname === "/about";
  const isContact = pathname === "/contact";

  const textColor = isLightTheme ? "#1c1d20" : "#ffffff";

  useEffect(() => {
    const handleScrollHero = () => {
      setScrolled(window.scrollY > window.innerHeight - 100);
    };

    window.addEventListener("scroll", handleScrollHero);
    handleScrollHero(); // init
    return () => window.removeEventListener("scroll", handleScrollHero);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent border-none py-2`}
        style={
          !scrolled
            ? { paddingTop: "2.4vh", paddingLeft: "3vw", paddingRight: "3vw" }
            : { paddingLeft: "3vw", paddingRight: "3vw" }
        }
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo / Left side */}
          {isContact ? (
            <div className="text-[#ffffff] text-[1.25vw] tracking-tight ml-[1vw]">
              © Websk
            </div>
          ) : (
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="flex items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/websk-signature-nav.png"
                alt="Websk"
                className="w-auto object-contain transition-all duration-300"
                style={{
                  height: "clamp(26px, 3vw, 52px)",
                  filter:
                    isLightTheme && !scrolled
                      ? "invert(1)"
                      : scrolled
                        ? "invert(1) opacity(0.9)"
                        : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                }}
              />
            </a>
          )}

          {/* Nav links / Right side */}
          <div className="flex items-center">
            <nav
              className={`hidden md:flex transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              style={{ gap: "1.8vw" }}
            >
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="relative transition-opacity duration-300 hover:opacity-60 font-normal"
                    style={{ fontSize: "1.1vw", color: textColor }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="absolute left-1/2 -bottom-[0.5vw] -translate-x-1/2 rounded-full"
                        style={{
                          width: "0.35vw",
                          height: "0.35vw",
                          backgroundColor: textColor,
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Nav Toggle */}
            <div
              className={`md:hidden ml-4 transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 transition-colors"
                style={{ color: textColor }}
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
        <div
          className={`fixed inset-0 z-40 bg-[#F4F3EF] flex flex-col pt-24 px-6 md:hidden`}
        >
          <nav className="flex flex-col gap-6">
            {mainLinks.map((link) => (
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
