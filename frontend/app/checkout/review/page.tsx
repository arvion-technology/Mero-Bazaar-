import { Suspense } from "react";
import ReviewContent from "./CheckoutReviewContent";

export default function ReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewContent />
    </Suspense>
  );
}