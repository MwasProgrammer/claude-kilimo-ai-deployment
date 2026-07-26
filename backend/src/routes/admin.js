import { Router } from "express";
import { query } from "../config/db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Everything below requires a valid Firebase session.
router.use(requireAdmin);

/** POST /api/admin/prices — add today's price for a market + crop. */
router.post("/prices", async (req, res) => {
  const { marketId, cropId, price, unit = "bag", trend = "stable" } = req.body;
  const marketIdNum = Number(marketId);
  const cropIdNum = Number(cropId);
  const priceNum = Number(price);

  if (
    marketId == null ||
    cropId == null ||
    price == null ||
    !Number.isFinite(marketIdNum) ||
    !Number.isFinite(cropIdNum) ||
    !Number.isFinite(priceNum)
  ) {
    return res.status(400).json({ error: "marketId, cropId, and price are required and must be valid numbers." });
  }

  try {
    const { rows } = await query(
      `INSERT INTO market_prices (market_id, crop_id, price, unit, trend, recorded_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [marketIdNum, cropIdNum, priceNum, unit, trend, req.admin.email]
    );
    res.status(201).json({ price: rows[0] });
  } catch (err) {
    console.error("[POST /api/admin/prices]", err);
    res.status(500).json({ error: "Failed to save price." });
  }
});

/** POST /api/admin/markets — add a new market (name, county, coordinates). */
router.post("/markets", async (req, res) => {
  const { name, county, latitude, longitude, marketType = "wholesale" } = req.body;

  if (!name || !county || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "name, county, latitude, and longitude are required." });
  }

  try {
    const { rows } = await query(
      `INSERT INTO markets (name, county, latitude, longitude, market_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, county, latitude, longitude, marketType]
    );
    res.status(201).json({ market: rows[0] });
  } catch (err) {
    console.error("[POST /api/admin/markets]", err);
    res.status(500).json({ error: "Failed to save market." });
  }
});

/** GET /api/admin/prices/recent — last 50 entries, for the admin table view. */
router.get("/prices/recent", async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT mp.id, m.name AS market_name, c.name AS crop_name, mp.price, mp.unit, mp.trend, mp.recorded_at
       FROM market_prices mp
       JOIN markets m ON m.id = mp.market_id
       JOIN crops c ON c.id = mp.crop_id
       ORDER BY mp.recorded_at DESC
       LIMIT 50`
    );
    res.json({ prices: rows });
  } catch (err) {
    console.error("[GET /api/admin/prices/recent]", err);
    res.status(500).json({ error: "Failed to fetch recent prices." });
  }
});

export default router;
