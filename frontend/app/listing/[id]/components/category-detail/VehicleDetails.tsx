import type { ListingDetail } from "../../../../types/listing";

type Props = {
  details: ListingDetail["details"];
};

export default function VehicleDetails({ details }: Props) {
  const leftRows: [string, string][] = [
    ["Drive Type",     details.driveType],
    ["Exterior Color", details.exteriorColor],
    ["Interior Color", details.interiorColor],
    ["Ownership",      details.ownership],
    ["Registration",   details.registration],
  ];

  const rightRows: [string, string][] = [
    ["Body Type",    details.bodyType],
    ["Mileage",      details.mileage],
    ["Fuel Type",    details.fuelType],
    ["Transmission", details.transmission],
    ["Engine",       details.engine],
  ];

  return (
    <div className="ld-details-card">
      <h2 className="ld-section-title">Vehicle Details</h2>
      <div className="ld-details-grid">
        {/* Left column */}
        <div className="ld-details-col">
          {leftRows.map(([label, val]) => (
            <div key={label} className="ld-detail-row">
              <span className="ld-detail-label">{label}</span>
              <span className="ld-detail-val">{val}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="ld-details-divider" />

        {/* Right column */}
        <div className="ld-details-col">
          {rightRows.map(([label, val]) => (
            <div key={label} className="ld-detail-row">
              <span className="ld-detail-label">{label}</span>
              <span className="ld-detail-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
