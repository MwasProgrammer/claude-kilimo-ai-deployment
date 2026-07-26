import { useLanguage } from "../context/LanguageContext.jsx";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-soil/15 bg-white/70 p-1 text-sm font-semibold">
      {["en", "sw"].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`rounded-full px-3 py-1 transition-colors ${
            language === lang
              ? "bg-leaf text-paper shadow-soft"
              : "text-soil-light hover:text-soil"
          }`}
        >
          {lang === "en" ? "EN" : "SW"}
        </button>
      ))}
    </div>
  );
}
