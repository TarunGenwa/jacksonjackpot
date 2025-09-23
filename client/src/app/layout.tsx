import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UnrevealedTicketsProvider } from "@/contexts/UnrevealedTicketsContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import AdminRouteGuard from "@/components/AdminRouteGuard";
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
          <ThemeProvider>
            <AuthProvider>
              <WalletProvider>
                <UnrevealedTicketsProvider>
                  <AdminRouteGuard>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                  </AdminRouteGuard>
                </UnrevealedTicketsProvider>
              </WalletProvider>
            </AuthProvider>
          </ThemeProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
