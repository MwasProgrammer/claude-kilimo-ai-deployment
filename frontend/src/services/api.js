const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  getCrops: () => request("/markets/crops"),
  getAllMarkets: () => request("/markets"),
  geocode: (place) => request(`/geocode?place=${encodeURIComponent(place)}`),
  getPrices: ({ crop, lat, lng, quantity }) =>
    request(`/prices?crop=${encodeURIComponent(crop)}&lat=${lat}&lng=${lng}&quantity=${quantity}`),
  getRecommendation: (payload) =>
    request("/ai/recommend", { method: "POST", body: JSON.stringify(payload) }),

  // Admin (Firebase-protected)
  addPrice: (payload, idToken) =>
    request("/admin/prices", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${idToken}` },
    }),
  addMarket: (payload, idToken) =>
    request("/admin/markets", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${idToken}` },
    }),
  getRecentPrices: (idToken) =>
    request("/admin/prices/recent", {
      headers: { Authorization: `Bearer ${idToken}` },
    }),
};
