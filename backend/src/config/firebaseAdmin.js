import admin from "firebase-admin";
import { readFileSync } from "fs";
import "dotenv/config";

let credential;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credential = admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    );
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const raw = readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8");
    credential = admin.credential.cert(JSON.parse(raw));
  }
} catch (err) {
  console.warn(
    "[firebaseAdmin] Could not load service account. Admin-only routes will reject requests until this is configured.",
    err.message
  );
}

export const firebaseApp = credential
  ? admin.initializeApp({ credential })
  : admin.apps.length
  ? admin.app()
  : null;

export const firebaseAuth = firebaseApp ? admin.auth(firebaseApp) : null;
