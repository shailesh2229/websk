import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Websk",
  description: "Personal portfolio of Shailesh Chaudhary",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon-32.png", sizes: "32x32" }
    ],
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
      <body className="bg-[#F4F3EF] text-[#111] min-h-[100dvh] flex flex-col font-sans relative transition-colors duration-500">
        <Navbar />
        <div id="page-shell" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

