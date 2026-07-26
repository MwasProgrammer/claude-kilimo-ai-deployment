import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Navbar() {
  const { t } = useLanguage();

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-leaf" : "text-soil-light hover:text-soil"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-soil/10 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-leaf text-paper font-display text-lg font-semibold">
            K
          </span>
          <span className="font-display text-xl font-semibold text-soil-dark">
            {t("appName")}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/check" className={linkClass}>
            {t("ctaCheckPrice")}
          </NavLink>
          <NavLink to="/admin/login" className={linkClass}>
            {t("admin")}
          </NavLink>
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
