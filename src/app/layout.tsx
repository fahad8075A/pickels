import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Zezty Pickles — Amma's Handcrafted Kerala Pickles | അമ്മയുടെ കൈപ്പുണ്യം",
  description:
    "Authentic homestyle Kerala pickles crafted with Amma's traditional recipes, cold-pressed gingelly oil, and fresh spices. മാങ്ങാ അച്ചാർ, വെളുത്തുള്ളി അച്ചാർ, മിക്സഡ് അച്ചാർ.",
  keywords: [
    "Kerala pickles",
    "Amma pickle",
    "അച്ചാർ",
    "Mango Pickle Kerala",
    "Kannimanga Achar",
    "Garlic Pickle",
    "Nadan Achar",
    "Zezty Pickles",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${malayalam.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FFF9EC] text-[#163D2D]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
