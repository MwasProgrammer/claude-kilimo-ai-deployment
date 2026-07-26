import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import CropSelector from "../components/CropSelector.jsx";
import LocationPicker from "../components/LocationPicker.jsx";

export default function PriceChecker() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState(40);
  const [location, setLocation] = useState(null);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!crop) return setFormError("Please choose a crop.");
    if (!quantity || quantity <= 0) return setFormError("Please enter how many bags you have.");
    if (!location) return setFormError("Please share your location so we can find nearby markets.");

    setFormError("");
    const params = new URLSearchParams({
      crop,
      quantity: String(quantity),
      lat: String(location.latitude),
      lng: String(location.longitude),
      county: location.label,
      lang: language,
    });
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-soil-dark">{t("ctaCheckPrice")}</h1>
      <p className="mt-2 text-soil-light">{t("heroBody")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 rounded-xl2 border-2 border-soil/10 bg-white/60 p-6 shadow-soft">
        <CropSelector value={crop} onChange={setCrop} />

        <div>
          <label htmlFor="quantity" className="mb-2 block text-sm font-semibold text-soil-dark">
            {t("quantity")}
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl2 border-2 border-soil/10 bg-white/70 px-4 py-3 text-soil-dark focus:border-leaf sm:w-48"
          />
        </div>

        <LocationPicker location={location} onChange={setLocation} />

        {formError && <p className="text-clay">{formError}</p>}

        <button
          type="submit"
          className="w-full rounded-xl2 bg-leaf px-6 py-3 font-semibold text-paper shadow-lift transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          {t("checkPrices")} →
        </button>
      </form>
    </div>
  );
}
