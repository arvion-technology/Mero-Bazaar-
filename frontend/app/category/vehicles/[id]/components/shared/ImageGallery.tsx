"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [activeImg, setActiveImg] = useState(0);

  const visibleThumbs = images.slice(0, 5);
  const extraCount    = images.length - 5;

  return (
    <div className="ld-img-card">
      {/* Main image */}
      <div className="ld-main-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeImg]}
          alt={title}
          className="ld-main-img"
        />
      </div>

      {/* Thumbnails */}
      <div className="ld-thumbs">
        {visibleThumbs.map((src, i) => (
          <div
            key={i}
            className={`ld-thumb-wrap${activeImg === i ? " active" : ""}`}
            onClick={() => setActiveImg(i)}
            role="button"
            aria-label={`View image ${i + 1}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Thumbnail ${i + 1}`} className="ld-thumb-img" />
            {i === 4 && extraCount > 0 && (
              <div className="ld-thumb-overlay">+{extraCount}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
