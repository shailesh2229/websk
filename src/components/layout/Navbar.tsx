"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [logoVisible, setLogoVisible] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <AnimatePresence>
            {logoVisible && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                src="/websk.png"
                alt="Websk"
                className="h-[30px] w-auto object-contain"
              />
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
