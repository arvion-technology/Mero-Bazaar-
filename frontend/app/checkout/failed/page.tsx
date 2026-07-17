import { Suspense } from "react";
import CheckoutFailedContent from "./CheckoutFailedContent";

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <CheckoutFailedContent />
    </Suspense>
  );
}