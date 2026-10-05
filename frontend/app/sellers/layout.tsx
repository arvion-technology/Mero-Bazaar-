import type { ReactNode } from "react";
import Footer from "@/components/Footer";

export default function SellerProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
      {children}
      <Footer />
    </div>
  );
}