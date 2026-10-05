"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="mb-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white text-[#1a1a1a] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition hover:-translate-x-0.5"
    >
      <FiArrowLeft size={18} />
    </button>
  );
}