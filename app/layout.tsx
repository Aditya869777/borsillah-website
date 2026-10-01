import { Cormorant_Garamond, DM_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CookieBanner from '@/components/CookieBanner';
import { ChatProvider } from '@/components/ChatContext';
import LenisWrapper from '@/components/LenisWrapper';
import type { Metadata, Viewport } from 'next';
import GlobalAIAssistant from '@/components/GlobalAIAssistant';

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Borsillah - From Assam to a Bigger Cup of Ambition",
  description: "Borsillah - an immersive brand story for an Assam CTC tea company. Premium tea, ambitious vision, built for scale.",
  authors: [{ name: "Borsillah" }],
  openGraph: {
    title: "Borsillah - From Assam to a Bigger Cup of Ambition",
    description: "Premium Assam CTC Tea. An immersive brand story.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b08",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${playfair.variable} ${cormorant.variable} ${dmMono.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning className="font-playfair font-sans">
        <ChatProvider>
          <LenisWrapper>
        {children}
        <CookieBanner />
        <GlobalAIAssistant />
        </LenisWrapper>
        </ChatProvider>
      </body>
    </html>
  );
}






