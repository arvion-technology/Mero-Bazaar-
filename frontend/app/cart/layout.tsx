import { FoodCartProvider } from "../context/FoodCartContext";

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <FoodCartProvider>{children}</FoodCartProvider>;
}