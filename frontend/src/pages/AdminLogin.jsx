import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AdminLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Sign-in failed. Check the email and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-2xl font-semibold text-soil-dark">{t("adminLogin")}</h1>
      <p className="mt-2 text-sm text-soil-light">
        For market officers entering today's prices. Farmers don't need an account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl2 border-2 border-soil/10 bg-white/60 p-6 shadow-soft">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-soil-dark">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl2 border-2 border-soil/10 bg-white/70 px-4 py-2.5 text-soil-dark focus:border-leaf"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-soil-dark">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl2 border-2 border-soil/10 bg-white/70 px-4 py-2.5 text-soil-dark focus:border-leaf"
          />
        </div>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl2 bg-leaf px-4 py-2.5 font-semibold text-paper shadow-soft disabled:opacity-60"
        >
          {loading ? "…" : t("signIn")}
        </button>
      </form>
    </div>
  );
}
