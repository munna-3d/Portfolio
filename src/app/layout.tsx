import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moon3dstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moon 3D Studio | Munna Ahmed — Senior 3D Artist & Automotive Specialist",
    template: "%s | Moon 3D Studio",
  },
  description: "High-end 3D automotive visualization, hard-surface CGI modeling, and real-time interactive rendering by Munna Ahmed (Moon 3D Studio).",
  keywords: [
    "Moon 3D Studio",
    "Munna Ahmed",
    "3D Artist",
    "Automotive CGI",
    "Vehicle 3D Modeling",
    "Hard Surface Modeling",
    "Blender Artist",
    "Unreal Engine 5",
    "3D Visualization",
    "Industrial Design",
  ],
  authors: [{ name: "Munna Ahmed", url: siteUrl }],
  creator: "Munna Ahmed",
  publisher: "Moon 3D Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Moon 3D Studio | Munna Ahmed — Senior 3D Artist & Automotive Specialist",
    description: "High-end 3D automotive visualization, hard-surface CGI modeling, and real-time interactive rendering by Munna Ahmed.",
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/sequence/frame_000.webp",
        width: 1920,
        height: 1080,
        alt: "Moon 3D Studio — 3D Automotive CGI Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon 3D Studio | Munna Ahmed — Senior 3D Artist & Automotive Specialist",
    description: "High-end 3D automotive visualization, hard-surface CGI modeling, and real-time interactive rendering.",
    images: ["/sequence/frame_000.webp"],
    creator: "@munna3d",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Munna Ahmed",
      alternateName: "Moon 3D Studio",
      url: siteUrl,
      jobTitle: "Senior 3D Artist & Automotive CGI Specialist",
      sameAs: [
        "https://www.artstation.com",
        "https://www.behance.net",
        "https://www.linkedin.com",
        "https://www.instagram.com"
      ],
      knowsAbout: [
        "Automotive 3D Visualization",
        "Hard Surface Modeling",
        "Real-Time 3D",
        "CGI Rendering",
        "Blender",
        "Unreal Engine 5",
        "Autodesk Maya",
        "Substance 3D Painter"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Moon 3D Studio",
      publisher: {
        "@id": `${siteUrl}/#person`
      },
      description: "Official portfolio and 3D visualization showcase of Munna Ahmed (Moon 3D Studio)."
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preload"
          href="/sequence/frame_000.webp"
          as="image"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground">

        {/* Global Live Status Indicator */}
        <div className="fixed top-6 right-6 z-[80] pointer-events-none hidden sm:block">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-500/90 drop-shadow-sm">System Live</span>
          </div>
        </div>

        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
