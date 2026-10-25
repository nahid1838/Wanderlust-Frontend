/**
 * Shared travel categories — single source of truth for the
 * add-travel-package form and the all-destinations filters.
 * Values are lowercase to match the API (e.g. "beach").
 */
export const CATEGORIES: { value: string; label: string }[] = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "city", label: "City" },
  { value: "wildlife", label: "Wildlife" },
  { value: "luxury", label: "Luxury" },
]
