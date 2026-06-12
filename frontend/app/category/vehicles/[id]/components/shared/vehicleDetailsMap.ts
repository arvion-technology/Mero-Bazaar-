import type { VehicleType } from "@/app/types/listing";

export const VEHICLE_DETAILS_LABELS: Record<
VehicleType,
Record<string, string>
> = {
  car: {
    body_type: "Body Type",
    drive_type: "Drive Type",
    transmission: "Transmission",
    seating_capacity: "Seating Capacity",
    engine_capacity: "Engine Capacity",
    exterior_color: "Exterior Color",
    interior_color: "Interior Color",
    registration_number: "Registration Number",
  },

  bike: {
    engine_cc: "Engine CC",
    drive_mechanism: "Drive Mechanism",
    brake_type: "Brake Type",
    start_type: "Start Type",
    registration_number: "Registration Number",
    color: "Color",
  },

  scooter: {
    engine_cc: "Engine CC",
    brake_type: "Brake Type",
    start_type: "Start Type",
    registration_number: "Registration Number",
    color: "Color",
  },

  ev: {
    battery_capacity: "Battery Capacity",
    range_km: "Range (KM)",
    charging_time: "Charging Time",
    fast_charging: "Fast Charging",
    registration_number: "Registration Number",
    color: "Color",
  },

  truck: {
    body_type: "Body Type",
    load_capacity_kg: "Load Capacity (KG)",
    axle_count: "Axle Count",
    transmission: "Transmission",
    registration_number: "Registration Number",
    color: "Color",
  },

  spare_parts: {
    part_type: "Part Type",
    compatible_with: "Compatible With",
    manufacturer: "Manufacturer",
    part_number: "Part Number",
    warranty: "Warranty",
  },
} as const;