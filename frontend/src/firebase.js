import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase Auth is used only for the Admin price-entry screen. The
// farmer-facing price check flow is intentionally login-free.
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
