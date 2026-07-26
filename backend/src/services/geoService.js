const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two lat/lng points, in km. */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Straight-line distance is used instead of a paid routing API to keep
 * this MVP free to run. It's padded by ~25% to roughly approximate real
 * road distance (rural Kenyan roads rarely run point-to-point).
 */
export function estimateRoadDistanceKm(lat1, lon1, lat2, lon2) {
  return haversineKm(lat1, lon1, lat2, lon2) * 1.25;
}

export function estimateTransportCost(distanceKm, quantity, ratePerKm) {
  // Rate is per km per unit (bag/crate); short trips still cost a minimum call-out fee.
  const raw = distanceKm * ratePerKm * Math.max(1, quantity / 10);
  const calloutMinimum = ratePerKm * 20;
  return Math.round(Math.max(raw, calloutMinimum));
}

/**
 * Geocodes a free-text place name (e.g. "Murang'a") via OpenStreetMap's
 * Nominatim with proper User-Agent headers to prevent 403 Forbidden errors.
 */
export async function geocodePlace(place) {
  const query = `${place}, Kenya`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "KilimoAI/1.0 (contact@kilimo.ai)",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim request failed: ${res.status}`);
  }

  const results = await res.json();
  if (!results.length) return null;

  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}