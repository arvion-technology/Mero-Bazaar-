import { VehicleType } from '@prisma/client';

export const VEHICLE_DETAILS_SCHEMA: Record<VehicleType, string[]> = {
  car: [
    "body_type",
    "drive_type",
    "transmission",
    "seating_capacity",
    "engine_capacity",
    "exterior_color",
    "interior_color",
    "registration_number",
  ],

  bike: [
    "engine_cc",
    "drive_mechanism",
    "brake_type",
    "start_type",
    "registration_number",
    "color",
  ],

  scooter: [
    "engine_cc",
    "brake_type",
    "start_type",
    "registration_number",
    "color",
  ],

  ev: [
    "battery_capacity",
    "range_km",
    "charging_time",
    "fast_charging",
    "registration_number",
    "color",
  ],

  truck: [
    "body_type",
    "load_capacity_kg",
    "axle_count",
    "transmission",
    "registration_number",
    "color",
  ],

  spare_parts: [
    "part_type",
    "compatible_with",
    "manufacturer",
    "part_number",
    "warranty",
  ],
};

export function sanitizeVehicleDetails(
  type: VehicleType,
  details: Record<string, any> = {},
): Record<string, any> {
  const allowedFields = VEHICLE_DETAILS_SCHEMA[type];

  if (!allowedFields) return {};

  const clean: Record<string, any> = {};

  for (const field of allowedFields) {
    if (
      details[field] !== undefined &&
      details[field] !== null &&
      details[field] !== ""
    ) {
      clean[field] = details[field];
    }
  }

  return clean;
}