import type { Metadata } from "next";
import { Marcellus, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
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

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex",
  subsets: ["latin"],
});

import { SignatureIntro } from "@/components/layout/SignatureIntro";
import { ZoomInitializer } from "@/components/layout/ZoomInitializer";
import { ZoomController } from "@/components/layout/ZoomController";
import { ZoomLayers } from "@/components/layout/ZoomLayers";
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
      className={`${marcellus.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} dark antialiased`}
      suppressHydrationWarning
      data-loader="playing"
    >
      <head>
        <link rel="preload" as="image" href="/websk-signature-nav.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.location.search.includes('loader=1')) {
                  delete document.documentElement.dataset.loader;
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-black text-white min-h-[100dvh] flex flex-col font-serif relative overflow-hidden overscroll-none touch-none">
        <ZoomInitializer>
          <SignatureIntro />
          <ZoomController>
            <div id="site-content" className="relative z-10 flex-1 flex flex-col h-[100dvh] overflow-hidden">
              <Navbar />
              <div className="sr-only" aria-hidden="true">
                {children}
              </div>
              <ZoomLayers />
            </div>
          </ZoomController>
        </ZoomInitializer>
      </body>
    </html>
  );
}
