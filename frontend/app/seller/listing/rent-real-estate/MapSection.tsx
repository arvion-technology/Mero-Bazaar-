"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BORDER = "#e2e8f0";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true });
  }, [center, map]);
  return null;
}

export default function MapSection({
  center,
  area,
  city,
}: {
  center: [number, number];
  area: string;
  city: string;
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "200px", borderRadius: "12px", border: `1.5px solid ${BORDER}`, zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={defaultIcon}>
        <Popup>
          <b>{area}</b><br />{city}
        </Popup>
      </Marker>
      <MapUpdater center={center} />
    </MapContainer>
  );
}