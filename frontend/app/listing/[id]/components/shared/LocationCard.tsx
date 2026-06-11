import { FiMapPin } from "react-icons/fi";
import type { ListingDetail } from "../../../../types/listing";

type Props = {
  location: ListingDetail["location"];
  distanceFrom: ListingDetail["distanceFrom"];
  googleMapsUrl: ListingDetail["googleMapsUrl"];
};

export default function LocationCard({ location, distanceFrom, googleMapsUrl }: Props) {
  return (
    <div className="ld-location-card" id="location">
      <p className="ld-location-card-title">Location</p>

      {/* Decorative map area with animated pin */}
      <div className="ld-map-area">
        {/* Static map grid lines — purely decorative */}
        <svg
          width="100%" height="100%"
          style={{ position: "absolute", inset: 0, opacity: 0.18 }}
          aria-hidden="true"
        >
          {/* Horizontal lines */}
          {[20, 40, 60, 80].map((y) => (
            <line key={`h${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#4a7c59" strokeWidth="1" />
          ))}
          {/* Vertical lines */}
          {[15, 30, 45, 60, 75, 90].map((x) => (
            <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#4a7c59" strokeWidth="1" />
          ))}
        </svg>

        {/* Animated map pin */}
        <div className="ld-map-pin" aria-label="Map pin">
          <FiMapPin size={28} color="#C0392B" fill="rgba(192,57,43,0.15)" />
          <div className="ld-map-label">{location}</div>
        </div>
      </div>

      {/* Address info */}
      <div className="ld-location-info">
        <p className="ld-location-name">{location}</p>
        <p className="ld-location-dist">{distanceFrom}</p>
        <p className="ld-location-extra">Exact location provided after contact</p>
      </div>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ld-map-view-link"
      >
        <FiMapPin size={14} color="#C0392B" />
        View on Google Maps
      </a>
    </div>
  );
}
