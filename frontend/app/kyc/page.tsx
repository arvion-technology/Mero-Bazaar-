import { Suspense } from "react";
import SellerKYCPage from "./SellerKYCPage";

export default function KYCPage() {
  return (
    <Suspense fallback={null}>
      <SellerKYCPage />
    </Suspense>
  );
}