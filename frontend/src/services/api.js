const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const BASE_URL = normalizeBaseUrl(rawBaseUrl);

function normalizeBaseUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  let normalized = trimmed;
  if (normalized.startsWith("https:/") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized.slice(7)}`;
  } else if (normalized.startsWith("http:/") && !normalized.startsWith("http://")) {
    normalized = `http://${normalized.slice(6)}`;
  }

  return normalized.replace(/\/+$/, "");
}

async function request(path, options = {}) {
  const resolvedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${resolvedPath}`, {
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
