import { useState } from "react";
import { api } from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function LocationPicker({ location, onChange }) {
  const { t } = useLanguage();
  const [placeText, setPlaceText] = useState(location?.label || "");
  const [status, setStatus] = useState("idle"); // idle | locating | error
  const [error, setError] = useState("");

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setError("GPS is not available on this device/browser.");
      return;
    }
    setStatus("locating");
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: "Current GPS location",
        });
        setPlaceText("Current GPS location");
        setStatus("idle");
      },
      () => {
        setError("Couldn't get your GPS location. Try typing your county instead.");
        setStatus("error");
      }
    );
  };

  const handleGeocode = async () => {
    if (!placeText.trim()) return;
    setStatus("locating");
    setError("");
    try {
      const result = await api.geocode(placeText.trim());
      onChange({
        latitude: result.latitude,
        longitude: result.longitude,
        label: placeText.trim(),
      });
      setStatus("idle");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-soil-dark">{t("location")}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={placeText}
          onChange={(e) => setPlaceText(e.target.value)}
          onBlur={handleGeocode}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleGeocode())}
          placeholder={t("locationPlaceholder")}
          className="flex-1 rounded-xl2 border-2 border-soil/10 bg-white/70 px-4 py-3 text-soil-dark placeholder:text-soil-light/60 focus:border-leaf"
        />
        <button
          type="button"
          onClick={handleUseGps}
          className="whitespace-nowrap rounded-xl2 border-2 border-sky/40 bg-sky/10 px-4 py-3 text-sm font-semibold text-sky hover:bg-sky/20"
        >
          📍 {t("useGps")}
        </button>
      </div>
      {status === "locating" && (
        <p className="mt-2 text-sm text-soil-light">Finding that location…</p>
      )}
      {error && <p className="mt-2 text-sm text-clay">{error}</p>}
      {location && status !== "locating" && (
        <p className="mt-2 text-sm text-leaf">
          ✓ Using: {location.label} ({location.latitude.toFixed(3)}, {location.longitude.toFixed(3)})
        </p>
      )}
    </div>
  );
}
