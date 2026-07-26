import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import pricesRouter from "./routes/prices.js";
import marketsRouter from "./routes/markets.js";
import aiRouter from "./routes/ai.js";
import adminRouter from "./routes/admin.js";
import geocodeRouter from "./routes/geocode.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow both localhost (for dev) and your deployed Vercel frontend domain
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests (no Origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Generous rate limit to protect API budget and Nominatim
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Root Health Check Routes
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Kilimo AI API Server is running!" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "kilimo-ai-backend" });
});

// API Routes
app.use("/api/prices", pricesRouter);
app.use("/api/markets", marketsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/geocode", geocodeRouter);

// 404 Catch-All Handler
app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// Unhandled Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[unhandled error]", err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

app.listen(PORT, () => {
  console.log(`Kilimo AI backend running on port ${PORT}`);
});
