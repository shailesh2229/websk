"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [logoVisible, setLogoVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // If we land on the page, the intro will dispatch introComplete when it finishes or skips
    const handleIntroComplete = () => setLogoVisible(true);
    window.addEventListener("introComplete", handleIntroComplete);
    
    // Fallback: just in case it was already skipped and we missed the event (e.g. HMR)
    const timer = setTimeout(() => {
      setLogoVisible(true);
    }, 6500);

    return () => {
      window.removeEventListener("introComplete", handleIntroComplete);
      clearTimeout(timer);
    };
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-[#22254a]">
      <div className="container mx-auto px-4 h-[84px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <AnimatePresence>
            {logoVisible && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                src="/websk-signature-nav.png"
                alt="Websk"
                className="h-[44px] md:h-[56px] w-auto object-contain drop-shadow-[0_0_10px_rgba(140,110,255,0.3)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </AnimatePresence>
        </Link>

        <nav className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-serif font-light transition-colors ${
                  isActive ? "text-white" : "text-[#9ea2c0] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
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
