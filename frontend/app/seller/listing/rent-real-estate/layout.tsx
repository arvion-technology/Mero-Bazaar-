import { ListingFormProvider } from "./page";

export default function RentRealEstateLayout({ children }: { children: React.ReactNode }) {
  return <ListingFormProvider>{children}</ListingFormProvider>;
}