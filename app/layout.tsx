import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatePresence } from "framer-motion";
import Analytics from "@/components/Analytics";
import GDPRConsent from "@/components/GDPRConsent";
import { GDPRConsentProvider } from "@/contexts/GDPRConsentProvider";
import JsonLd from "@/components/JsonLd";
import MetaTags from "@/components/MetaTags";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Global Games - Play Free Online Games',
    template: '%s | Global Games'
  },
    icons: {
    icon: "/logo2.png",
  },
  description: 'Play huge collection of free online games at Global Games. Enjoy the best HTML5 games in various categories including action, adventure, puzzle, and more!',
  keywords: ['online games', 'free games', 'browser games', 'HTML5 games', 'play games online'],
  authors: [{ name: 'Global Games Team' }],
  creator: 'Global Games',
  publisher: 'Global Games',
  metadataBase: new URL('https://globalgames.store'),
  openGraph: {
    title: 'Global Games - Play Free Online Games',
    description: 'Play huge collection of free online games at Global Games. Enjoy the best HTML5 games in various categories!',
    url: 'https://globalgames.store',
    siteName: 'Global Games',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Global Games - Play Free Online Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Games - Play Free Online Games',
    description: 'Play huge collection of free online games at Global Games. Enjoy the best HTML5 games in various categories!',
    images: ['/images/twitter-card.jpg'],
    creator: '@globalgames',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    yandex: 'YANDEX_VERIFICATION_CODE',
  },
  alternates: {
    canonical: 'https://globalgames.store',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <MetaTags />
        <link rel="icon" href="/logo2.png" type="image/x-icon" />
        <link rel="shortcut icon" href="/icon" type="image/x-icon" />
        <link rel="canonical" href="https://globalgames.store" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1495080734174825" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <GDPRConsentProvider>
          <JsonLd
            type="WebSite"
            data={{
              name: "Global Games",
              url: "https://globalgames.store",
              description: "Play huge collection of free online games at Global Games. Enjoy the best HTML5 games in various categories!",
              potentialAction: [
                {
                  '@type': 'SearchAction',
                  target: 'https://globalgames.store/search?q={search_term_string}',
                  'query-input': 'required name=search_term_string'
                }
              ]
            }}
          />
          <Header />
          <AnimatePresence mode="wait">
            <main className="min-h-[calc(100vh-11rem)]">{children}</main>
          </AnimatePresence>
          <Footer />
          <Analytics />
          <GDPRConsent />
        </GDPRConsentProvider>
      </body>
    </html>
  );
}
