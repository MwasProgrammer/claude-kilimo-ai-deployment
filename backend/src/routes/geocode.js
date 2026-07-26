import { Router } from "express";
import { geocodePlace } from "../services/geoService.js";

const router = Router();

/** GET /api/geocode?place=Murang'a */
router.get("/", async (req, res) => {
  const { place } = req.query;
  if (!place) return res.status(400).json({ error: "place query param is required." });

  try {
    const result = await geocodePlace(place);
    if (!result) {
      return res.status(404).json({ error: `Could not find "${place}" in Kenya.` });
    }
    res.json(result);
  } catch (err) {
    console.error("[GET /api/geocode]", err);
    res.status(500).json({ error: "Geocoding lookup failed." });
  }
});

export default router;
