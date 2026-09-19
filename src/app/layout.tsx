import type { Metadata } from "next";
import { Marcellus, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  variable: "--font-marcellus",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { SignatureIntro } from "@/components/layout/SignatureIntro";
import { SiteBackground } from "@/components/layout/SiteBackground";

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
      className={`${marcellus.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.location.search.includes('loader=1')) {
                  document.documentElement.dataset.loader = 'playing';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-transparent text-white min-h-screen flex flex-col font-serif relative">
        <SiteBackground />
        <SignatureIntro />
        <div id="site-content" className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
