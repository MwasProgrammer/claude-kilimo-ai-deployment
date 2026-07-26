import { Router } from "express";
import { query } from "../config/db.js";
import { estimateRoadDistanceKm, estimateTransportCost } from "../services/geoService.js";

const router = Router();
const RATE_PER_KM = Number(process.env.DEFAULT_RATE_PER_KM || 65);

/**
 * GET /api/prices?crop=potatoes&lat=-0.7167&lng=37.15&quantity=40
 *
 * Returns every market's latest price for the given crop, each annotated
 * with distance from the farmer, an estimated transport cost, expected
 * revenue, and net profit — everything the AI step and the dashboard need.
 */
router.get("/", async (req, res) => {
  const { crop, lat, lng, quantity } = req.query;

  if (!crop || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: "crop, lat, and lng query params are required." });
  }

  const farmerLat = parseFloat(lat);
  const farmerLng = parseFloat(lng);
  const qty = Math.max(1, parseFloat(quantity) || 1);

  try {
    const { rows } = await query(
      `SELECT DISTINCT ON (m.id)
         m.id AS market_id, m.name, m.county, m.latitude, m.longitude, m.market_type,
         mp.price, mp.unit, mp.trend, mp.recorded_at
       FROM market_prices mp
       JOIN markets m ON m.id = mp.market_id
       JOIN crops c ON c.id = mp.crop_id
       WHERE lower(c.name) = lower($1)
       ORDER BY m.id, mp.recorded_at DESC`,
      [crop]
    );

    if (!rows.length) {
      return res.status(404).json({
        error: `No prices recorded yet for "${crop}". Ask an admin to add prices first.`,
      });
    }

    const markets = rows.map((r) => {
      const distanceKm = estimateRoadDistanceKm(
        farmerLat,
        farmerLng,
        Number(r.latitude),
        Number(r.longitude)
      );
      const transportCost =
        r.market_type === "broker" ? 0 : estimateTransportCost(distanceKm, qty, RATE_PER_KM);
      const revenue = Number(r.price) * qty;
      const netProfit = revenue - transportCost;

      return {
        marketId: r.market_id,
        name: r.name,
        county: r.county,
        marketType: r.market_type,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        price: Number(r.price),
        unit: r.unit,
        trend: r.trend,
        distanceKm: Math.round(distanceKm * 10) / 10,
        transportCost,
        revenue: Math.round(revenue),
        netProfit: Math.round(netProfit),
        lastUpdated: r.recorded_at,
      };
    });

    markets.sort((a, b) => b.netProfit - a.netProfit);

    res.json({ crop, quantity: qty, markets });
  } catch (err) {
    console.error("[GET /api/prices]", err);
    res.status(500).json({ error: "Failed to fetch prices." });
  }
});

export default router;
