import { firebaseAuth } from "../config/firebaseAdmin.js";

/**
 * Protects admin routes (price entry, edits) with Firebase Auth.
 * Farmers never hit this middleware — the price-check flow stays
 * login-free, per the MVP scope.
 */
export async function requireAdmin(req, res, next) {
  if (!firebaseAuth) {
    return res.status(500).json({
      error: "Firebase Admin is not configured on the server. See backend/.env.example.",
    });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization: Bearer <token> header." });
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    req.admin = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session. Please sign in again." });
  }
}
