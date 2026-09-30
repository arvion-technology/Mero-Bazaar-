export const ACTIVITY_LABELS: Record<string, string> = {
  PASSWORD_CHANGED: "Password changed",
  TWO_FA_ENABLED: "Two-factor authentication enabled",
  TWO_FA_DISABLED: "Two-factor authentication disabled",
  PHONE_CHANGED: "Phone number changed",
};

export function isKnownActivity(type: string) {
  return type in ACTIVITY_LABELS;
}

export function activityLabel(type: string) {
  return ACTIVITY_LABELS[type] ?? type;
}