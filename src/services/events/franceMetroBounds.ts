/**
 * Même emprise que `FRANCE_METRO_CAMERA_BOUNDS` (carte) — coins pour `bbox[ne|sw][lat|lng]` sur `GET /api/v3/events`.
 */
export const FRANCE_METRO_EVENTS_BBOX = {
  ne: { lat: 51.6, lng: 9.7 },
  sw: { lat: 40.3, lng: -6.2 },
} as const
