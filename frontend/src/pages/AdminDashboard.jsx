import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { api } from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const [crops, setCrops] = useState([]);
  const [allMarkets, setAllMarkets] = useState([]);
  const [recent, setRecent] = useState([]);
  const [form, setForm] = useState({ marketId: "", cropId: "", price: "", trend: "stable" });
  const [status, setStatus] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;
    api.getCrops().then((d) => setCrops(d.crops || [])).catch(() => {});
    api.getAllMarkets().then((d) => setAllMarkets(d.markets || [])).catch(() => {});
    refreshRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-select first market and crop when data finishes loading
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      marketId: prev.marketId || (allMarkets.length > 0 ? allMarkets[0].id : ""),
      cropId: prev.cropId || (crops.length > 0 ? crops[0].id : ""),
    }));
  }, [allMarkets, crops]);

  const refreshRecent = async () => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();
    api.getRecentPrices(token).then((d) => setRecent(d.prices || [])).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const token = await auth.currentUser.getIdToken();
      await api.addPrice(
        {
          marketId: Number(form.marketId),
          cropId: Number(form.cropId),
          price: Number(form.price),
          trend: form.trend,
        },
        token
      );
      setStatus("saved");
      setForm((prev) => ({ ...prev, price: "" }));
      refreshRecent();
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (user === undefined) return null;
  if (user === null) return <Navigate to="/admin/login" replace />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-soil-dark">{t("admin")}</h1>
        <button
          onClick={() => signOut(auth)}
          className="rounded-xl2 border-2 border-soil/15 px-4 py-2 text-sm font-semibold text-soil-dark hover:border-soil/30"
        >
          {t("signOut")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl2 border-2 border-soil/10 bg-white/60 p-6 shadow-soft sm:grid-cols-2">
        <h2 className="font-display text-lg font-semibold text-soil-dark sm:col-span-2">
          {t("addPrice")}
        </h2>

        <select
          required
          value={form.marketId}
          onChange={(e) => setForm({ ...form, marketId: e.target.value })}
          className="rounded-xl2 border-2 border-soil/10 bg-white px-4 py-2.5 text-soil-dark"
        >
          <option value="" disabled>{t("market")}</option>
          {allMarkets.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.county})</option>
          ))}
        </select>

        <select
          required
          value={form.cropId}
          onChange={(e) => setForm({ ...form, cropId: e.target.value })}
          className="rounded-xl2 border-2 border-soil/10 bg-white px-4 py-2.5 text-soil-dark"
        >
          <option value="" disabled>{t("crop")}</option>
          {crops.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          required
          type="number"
          min="1"
          placeholder={t("price")}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-xl2 border-2 border-soil/10 bg-white px-4 py-2.5 text-soil-dark"
        />

        <select
          value={form.trend}
          onChange={(e) => setForm({ ...form, trend: e.target.value })}
          className="rounded-xl2 border-2 border-soil/10 bg-white px-4 py-2.5 text-soil-dark"
        >
          <option value="stable">{t("stable")}</option>
          <option value="rising">{t("rising")}</option>
          <option value="falling">{t("falling")}</option>
        </select>

        <button
          type="submit"
          className="rounded-xl2 bg-leaf px-4 py-2.5 font-semibold text-paper shadow-soft sm:col-span-2 hover:bg-leaf/90"
        >
          {t("save")}
        </button>
        {status === "saved" && <p className="text-leaf sm:col-span-2 font-medium">Saved successfully!</p>}
        {status && status !== "saved" && <p className="text-clay sm:col-span-2 font-medium">{status}</p>}
      </form>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-soil-dark">{t("recentEntries")}</h2>
        <div className="overflow-hidden rounded-xl2 border-2 border-soil/10 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-soil/5 text-soil-light">
              <tr>
                <th className="px-4 py-2 font-semibold">{t("market")}</th>
                <th className="px-4 py-2 font-semibold">{t("crop")}</th>
                <th className="px-4 py-2 font-semibold">{t("price")}</th>
                <th className="px-4 py-2 font-semibold">{t("trend")}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-t border-soil/10">
                  <td className="px-4 py-2">{row.market_name}</td>
                  <td className="px-4 py-2">{row.crop_name}</td>
                  <td className="px-4 py-2 font-data tabular">KSh {Number(row.price).toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}