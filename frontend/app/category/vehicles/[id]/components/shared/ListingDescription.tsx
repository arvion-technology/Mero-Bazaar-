"use client";

import { useState } from "react";

type Props = {
  description: string;
};

export default function ListingDescription({ description }: Props) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="ld-desc-card">
      <h2 className="ld-section-title">Description</h2>
      <p className={`ld-desc-text${!showFull ? " clamped" : ""}`}>
        {description}
      </p>
      <button
        className="ld-see-more"
        onClick={() => setShowFull((v) => !v)}
      >
        {showFull ? "See Less" : "See More"}
      </button>
    </div>
  );
}
