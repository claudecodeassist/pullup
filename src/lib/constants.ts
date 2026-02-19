export const Colors = {
  primary: "#FA4616",
  secondary: "#0021A5",
  white: "#FFFFFF",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  overlay: "rgba(0,0,0,0.5)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export type Sport = "pickleball" | "spikeball";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "any";
export type GameStatus = "open" | "full" | "cancelled" | "completed";

export const SPORTS: { value: Sport; label: string; emoji: string }[] = [
  { value: "pickleball", label: "Pickleball", emoji: "🏓" },
  { value: "spikeball", label: "Spikeball", emoji: "🔵" },
];

export const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "any", label: "Any Level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const UF_LOCATIONS = [
  { id: "flavet", name: "Flavet Field", lat: 29.6499, lng: -82.3486 },
  { id: "sw-rec-indoor", name: "SW Rec (Indoor)", lat: 29.6397, lng: -82.3534 },
  { id: "sw-rec-outdoor", name: "SW Rec (Outdoor)", lat: 29.6393, lng: -82.3539 },
  { id: "lake-alice", name: "Lake Alice Fields", lat: 29.6428, lng: -82.3614 },
  { id: "reitz-lawn", name: "Reitz Lawn", lat: 29.6462, lng: -82.3478 },
  { id: "hume", name: "Hume Field", lat: 29.6449, lng: -82.3404 },
  { id: "ring-road", name: "Ring Road Fields", lat: 29.6501, lng: -82.3408 },
] as const;

export const UF_CAMPUS_CENTER = {
  latitude: 29.6436,
  longitude: -82.3549,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export const UF_EMAIL_DOMAIN = "@ufl.edu";
