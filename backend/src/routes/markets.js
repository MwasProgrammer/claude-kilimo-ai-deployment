import { Router } from "express";
import { query } from "../config/db.js";

const router = Router();

/** GET /api/markets/crops — powers the crop selection dropdown. */
router.get("/crops", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, name, name_sw, default_unit, bag_weight_kg FROM crops ORDER BY name"
    );
    res.json({ crops: rows });
  } catch (err) {
    console.error("[GET /api/markets/crops]", err);
    res.status(500).json({ error: "Failed to fetch crops." });
  }
});

/** GET /api/markets — all known markets, for the map + admin page. */
router.get("/", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, name, county, latitude, longitude, market_type FROM markets ORDER BY name"
    );
    res.json({ markets: rows });
  } catch (err) {
    console.error("[GET /api/markets]", err);
    res.status(500).json({ error: "Failed to fetch markets." });
  }
});

export default router;
