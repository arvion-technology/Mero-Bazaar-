import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "../components/AuthProviders";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HamroNepal Bazaar – Buy, Sell, Book Trusted Services Across Nepal",
  description:
    "Nepal's most trusted digital marketplace. Buy, sell, book and find services across Nepal. Verified sellers, safe payments, buyer protection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" className={inter.variable} >
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
