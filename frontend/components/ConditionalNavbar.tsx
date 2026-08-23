"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hideNavbar =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/user");

  if (hideNavbar) return null;

  return <Navbar />;
}