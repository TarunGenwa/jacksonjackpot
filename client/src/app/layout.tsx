import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BasketProvider } from "@/contexts/BasketContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BetSlipWrapper from "@/components/BetSlipWrapper";
import { ChakraProvider } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jackson Jackpot - Win Amazing Prizes While Supporting Great Causes",
  description: "Enter charity competitions and lotteries to win incredible prizes while making a difference. 100% transparent, verified charities, and life-changing rewards await.",
  keywords: "charity lottery, competitions, prizes, donations, fundraising, win prizes, support charity",
  openGraph: {
    title: "Jackson Jackpot - Win Amazing Prizes While Supporting Great Causes",
    description: "Enter charity competitions and lotteries to win incredible prizes while making a difference.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChakraProvider>
          <AuthProvider>
            <BasketProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: 1 }}>
                  {children}
                </main>
                <Footer />
                <BetSlipWrapper />
              </div>
            </BasketProvider>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
