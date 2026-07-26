import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const CROP_ICONS = {
  Maize: "🌽",
  Potatoes: "🥔",
  Tomatoes: "🍅",
  Beans: "🫘",
};

const FALLBACK_CROPS = [
  { id: "Maize", name: "Maize", name_sw: "Mahindi" },
  { id: "Potatoes", name: "Potatoes", name_sw: "Viazi" },
  { id: "Tomatoes", name: "Tomatoes", name_sw: "Nyanya" },
  { id: "Beans", name: "Beans", name_sw: "Maharagwe" },
];

export default function CropSelector({ value, onChange }) {
  const { language, t } = useLanguage();
  const [crops, setCrops] = useState(FALLBACK_CROPS);

  useEffect(() => {
    api
      .getCrops()
      .then((data) => {
        if (data.crops?.length) setCrops(data.crops);
      })
      .catch(() => {
        // Keep fallback list — backend may not be running yet during setup.
      });
  }, []);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-soil-dark">{t("crop")}</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {crops.map((crop) => {
          const isActive = value === crop.name;
          return (
            <button
              key={crop.name}
              type="button"
              onClick={() => onChange(crop.name)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-2 rounded-xl2 border-2 px-3 py-4 transition-all ${
                isActive
                  ? "border-leaf bg-leaf/10 shadow-soft"
                  : "border-soil/10 bg-white/70 hover:border-leaf/40"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {CROP_ICONS[crop.name] || "🌾"}
              </span>
              <span className="text-sm font-semibold text-soil-dark">
                {language === "sw" ? crop.name_sw || crop.name : crop.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
