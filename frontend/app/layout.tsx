import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import AuthProvider from "../components/AuthProviders";
import { FoodCartProvider } from "./context/FoodCartContext";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
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
    <html lang="ne" className={inter.variable}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <FoodCartProvider>
            <ConditionalNavbar />
            {children}
          </FoodCartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}