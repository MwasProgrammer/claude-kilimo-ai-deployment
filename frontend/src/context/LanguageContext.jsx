import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("kilimo_lang") || "en"
  );

  const setLanguagePersisted = (lang) => {
    setLanguage(lang);
    localStorage.setItem("kilimo_lang", lang);
  };

  const t = useMemo(() => {
    const dict = translations[language] || translations.en;
    return (key) => dict[key] ?? translations.en[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguagePersisted, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
