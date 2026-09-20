"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Mail,
  ArrowUpRight,
} from "lucide-react";

const Linkedin = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const Github = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const Instagram = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
import { profile } from "@/data/profile";
import { useZoom } from "@/components/layout/ZoomContext";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor={"var(--yellow-500)"} />
              <stop offset="25%" stopColor={"var(--red-500)"} />
              <stop offset="50%" stopColor={"var(--blue-500)"} />
              <stop offset="75%" stopColor={"var(--cyan-500)"} />
              <stop offset="100%" stopColor={"var(--violet-500)"} />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={
            maskPosition.cx !== "50%" && maskPosition.cy !== "50%"
              ? {
                  cx: maskPosition.cx,
                  cy: maskPosition.cy,
                }
              : undefined
          }
          transition={{ type: "spring", stiffness: 300, damping: 50 }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="96"
        textAnchor="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0, fontSize: "60px" }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="96"
        textAnchor="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#3ca2fa] font-[helvetica] font-bold dark:stroke-[#3ca2fa99]"
        style={{ fontSize: "60px" }}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{
          duration: duration || 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="96"
        textAnchor="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] font-bold"
        style={{ fontSize: "60px" }}
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
      }}
    />
  );
};

function HoverFooter() {
  const { setTargetPage } = useZoom();

  // Handle routing internally via Zoom context for mapped pages
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const map: Record<string, number> = {
      "/": 0,
      "/about": 1,
      "/services": 2,
      "/work": 3
    };
    if (path in map) {
      setTargetPage(map[path]);
    } else {
      // For contact or unknown, use standard navigation
      window.location.href = path;
    }
  };

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Work", href: "/work" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Design", href: "/services" },
        { label: "Frontend Development", href: "/services" },
        { label: "Full-stack Next.js Applications", href: "/services" },
        { label: "3D Web Experiences", href: "/services" },
      ],
    },
  ];

  return (
    <div className="dark bg-[#01030f] w-full relative" style={{ paddingBlock: 'clamp(80px, 12vh, 200px)' }}>
      <footer className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden mx-4 md:mx-8 xl:mx-auto max-w-[1440px]" style={{ fontFamily: 'var(--font-nunito-sans)' }}>
        <div className="max-w-7xl mx-auto p-8 md:p-14 z-40 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
            {/* Brand section */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-[#3ca2fa] text-3xl font-extrabold">
                  &hearts;
                </span>
                <span className="text-white text-3xl font-bold">Websk</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                Custom websites, designed and coded from scratch. Fast, modern, and built for your business.
              </p>
            </div>

            {/* Footer link sections */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-white text-lg font-semibold mb-6">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label} className="relative">
                      <a
                        href={link.href}
                        onClick={(e) => handleNavigation(e, link.href)}
                        className="text-gray-300 hover:text-[#3ca2fa] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-6">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-[#3ca2fa] shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-gray-300 hover:text-[#3ca2fa] transition-colors break-all text-base"
                  >
                    {profile.email}
                  </a>
                </li>
                <li>
                  <div className="flex items-center space-x-3 mb-2">
                    <ArrowUpRight size={18} className="text-[#3ca2fa] shrink-0" />
                    <a
                      href="/contact"
                      className="text-gray-300 hover:text-[#3ca2fa] transition-colors relative text-base"
                    >
                      Get In Touch
                      <span className="absolute top-0 -right-4 w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
                    </a>
                  </div>
                  <p className="text-sm text-gray-500 pl-8">Currently available for new opportunities.</p>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-t border-gray-700 my-8" />

          {/* Footer bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
            {/* Social icons */}
            <div className="flex space-x-6 text-gray-400">
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#3ca2fa] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#3ca2fa] transition-colors">
                <Github size={20} />
              </a>
              <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#3ca2fa] transition-colors">
                <Instagram size={20} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-center md:text-left text-gray-400">
              &copy; {new Date().getFullYear()} WEBSK. All rights reserved.
            </p>
          </div>
        </div>

        {/* Text hover effect */}
        <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36">
          <TextHoverEffect text="WEBSK" className="z-50" />
        </div>

        <FooterBackgroundGradient />
      </footer>
    </div>
  );
}

export default HoverFooter;
