"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green pickup marker
const pickupIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-green-500 shadow-[0_2px_8px_rgba(34,197,94,0.4)]">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Red dropoff marker
const dropoffIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.4)]">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Auto-fit bounds to show both markers
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, positions]);

  return null;
}

interface DeliveryMapProps {
  pickup: [number, number];
  dropoff: [number, number];
  pickupLabel: string;
  dropoffLabel: string;
}

export default function DeliveryMap({
  pickup,
  dropoff,
  pickupLabel,
  dropoffLabel,
}: DeliveryMapProps) {
  const positions = useMemo(() => [pickup, dropoff], [pickup, dropoff]);

  const center = useMemo<[number, number]>(
    () => [
      (pickup[0] + dropoff[0]) / 2,
      (pickup[1] + dropoff[1]) / 2,
    ],
    [pickup, dropoff]
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-[10px]"
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds positions={positions} />

      {/* Route line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#6366f1",
          weight: 4,
          opacity: 0.8,
          dashArray: "10, 8",
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* Pickup marker */}
      <Marker position={pickup} icon={pickupIcon}>
        <Popup>
          <div className="text-[13px] font-semibold">
            {pickupLabel}
          </div>
          <div className="text-[11px] text-slate-500">
            Pickup Location
          </div>
        </Popup>
      </Marker>

      {/* Dropoff marker */}
      <Marker position={dropoff} icon={dropoffIcon}>
        <Popup>
          <div className="text-[13px] font-semibold">
            {dropoffLabel}
          </div>
          <div className="text-[11px] text-slate-500">
            Delivery Location
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
