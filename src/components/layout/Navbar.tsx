/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navDirection } from "@/lib/nav-direction";

const PAGES = ["/", "/about", "/services", "/work", "/contact"];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === pathname) return;
    const currentIdx = PAGES.indexOf(pathname);
    const targetIdx = PAGES.indexOf(href);
    if (currentIdx !== -1 && targetIdx !== -1) {
      navDirection.set(targetIdx > currentIdx ? "next" : "prev");
    }
    router.push(href, { scroll: false });
  };

  return (
    <header id="navbar" className="fixed top-0 left-0 right-0 z-50 bg-[linear-gradient(to_bottom,rgba(2,3,12,0.85),rgba(2,3,12,0))] border-b border-[#22254a]">
      <div className="container mx-auto px-4 h-[84px] flex items-center justify-between">
        <a href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/websk-signature-nav.png"
            alt="Websk"
            width="145"
            height="56"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="h-[44px] md:h-[56px] w-auto object-contain drop-shadow-[0_0_10px_rgba(140,110,255,0.3)]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </a>

        <nav className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[15px] font-serif font-light transition-colors ${
                  isActive ? "text-white" : "text-[#9ea2c0] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

