/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useZoom, PAGES } from "./ZoomContext";
import { useState } from "react";
import { useMotionValueEvent } from "framer-motion";

export function Navbar() {
  const { setTargetPage, progress } = useZoom();
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    setActiveIndex(Math.round(latest));
  });

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    e.preventDefault();
    setTargetPage(index);
  };

  return (
    <header id="navbar" className="fixed top-0 left-0 right-0 z-50 bg-[linear-gradient(to_bottom,rgba(2,3,12,0.85),rgba(2,3,12,0))] border-b border-[#22254a]">
      <div className="container mx-auto px-4 h-[84px] flex items-center justify-between">
        <a href="/" onClick={(e) => handleNavClick(e, 0, "/")} className="flex items-center">
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
          {links.map((link, idx) => {
            const isActive = activeIndex === idx;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, idx, link.href)}
                className={`text-[15px] font-serif font-light transition-colors ${
                  isActive ? "text-white" : "text-[#9ea2c0] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <Link
            href="/contact"
            className="text-[15px] font-serif font-light transition-colors text-[#9ea2c0] hover:text-white"
          >
            Contact
          </Link>
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
