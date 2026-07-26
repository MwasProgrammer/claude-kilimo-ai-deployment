import { Router } from "express";
import { getAIRecommendation } from "../services/claudeService.js";
import { query } from "../config/db.js";

const router = Router();

/**
 * POST /api/ai/recommend
 * body: { crop, quantity, county, markets: [...as returned by GET /api/prices], language }
 *
 * Persists the query + recommendation for later analytics, then returns
 * Claude's plain-language advice alongside the numbers it was given.
 */
router.post("/recommend", async (req, res) => {
  const { crop, quantity, county, markets, language = "en" } = req.body;

  if (!crop || !Array.isArray(markets) || markets.length === 0) {
    return res.status(400).json({ error: "crop and a non-empty markets array are required." });
  }

  try {
    const recommendation = await getAIRecommendation({ crop, quantity, county, markets, language });

    // Best-effort logging — don't fail the request if this insert has issues.
    try {
      const cropRow = await query("SELECT id FROM crops WHERE lower(name) = lower($1)", [crop]);
      if (cropRow.rows[0]) {
        const queryRow = await query(
          `INSERT INTO queries (crop_id, quantity, county) VALUES ($1, $2, $3) RETURNING id`,
          [cropRow.rows[0].id, quantity, county]
        );
        const bestMarket = markets.find((m) => m.name === recommendation.bestMarketName);
        await query(
          `INSERT INTO ai_recommendations (query_id, best_market_id, expected_profit, recommendation_text, language)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            queryRow.rows[0].id,
            bestMarket?.marketId ?? null,
            recommendation.expectedProfit,
            recommendation.recommendationText,
            language,
          ]
        );
      }
    } catch (logErr) {
      console.warn("[POST /api/ai/recommend] logging skipped:", logErr.message);
    }

    res.json({ recommendation });
  } catch (err) {
    console.error("[POST /api/ai/recommend]", err);
    res.status(500).json({ error: "AI recommendation failed. Please try again." });
  }
});

export default router;
