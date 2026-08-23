import { ListingFormProvider } from "./ListingFormContext";

export default function RentRealEstateLayout({ children }: { children: React.ReactNode }) {
  return <ListingFormProvider>{children}</ListingFormProvider>;
}