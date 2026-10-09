import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
export const metadata: Metadata = {
  title: "Websk",
  description: "Personal portfolio of Shailesh Chaudhary",
  icons: {
    icon: [{ url: "/favicon.png" }, { url: "/favicon-32.png", sizes: "32x32" }],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/websk-signature-nav.png" />
      </head>
      <body className="bg-[#ffffff] text-[#1c1d20] min-h-[100dvh] flex flex-col font-sans relative">
        <SmoothScroll>
          <Navbar />
          <MenuOverlay />
          <div
            id="page-shell"
            className="relative z-10 w-full min-h-screen bg-[#ffffff]"
          >
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
