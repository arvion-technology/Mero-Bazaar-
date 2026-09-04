import { Suspense } from "react";
import SellerKYCPage from "./SellerKYCPage";

export const dynamic = 'force-dynamic';

export default function KYCPage() {
  return (
    <Suspense fallback={null}>
      <SellerKYCPage />
    </Suspense>
  );
}