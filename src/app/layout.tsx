import type { Metadata } from "next";
import { Marcellus, JetBrains_Mono, IBM_Plex_Mono, Nunito_Sans } from "next/font/google";
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

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

import { SignatureIntro } from "@/components/layout/SignatureIntro";
import { Navbar } from "@/components/layout/Navbar";
import { PageNavigator } from "@/components/PageNavigator";

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
      className={`${marcellus.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} ${nunitoSans.variable} dark antialiased`}
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
      <body className="bg-black text-white min-h-[100dvh] flex flex-col font-serif relative" style={{ overflowX: "clip" }}>
        <SignatureIntro />
        <Navbar />
        <PageNavigator />
        <div id="page-shell" className="relative z-10 flex-1 flex flex-col" style={{ overflowX: "clip" }}>
          {children}
        </div>
      </body>
    </html>
  );
}

