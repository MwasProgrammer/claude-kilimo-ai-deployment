import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProfitLadder from "../components/ProfitLadder.jsx";

const DEMO_MARKETS = [
  { marketId: 1, name: "Marikiti Market", county: "Nairobi", price: 3850, unit: "bag", distanceKm: 140, transportCost: 9000, revenue: 154000, netProfit: 145000, trend: "rising" },
  { marketId: 2, name: "Wakulima Market", county: "Murang'a", price: 3600, unit: "bag", distanceKm: 120, transportCost: 8500, revenue: 144000, netProfit: 135500, trend: "stable" },
  { marketId: 3, name: "Nyeri Market", county: "Nyeri", price: 3500, unit: "bag", distanceKm: 80, transportCost: 6000, revenue: 140000, netProfit: 134000, trend: "stable" },
  { marketId: 4, name: "Local Broker", county: "Murang'a", price: 2800, unit: "bag", distanceKm: 0, transportCost: 0, revenue: 112000, netProfit: 112000, trend: "falling" },
];

const STEPS = [
  { key: "step1", icon: "🌽" },
  { key: "step2", icon: "📍" },
  { key: "step3", icon: "⚖️" },
  { key: "step4", icon: "✦" },
];

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="contour-field border-b border-soil/10 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full bg-maize/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-maize-dark">
              {t("appName")} · {t("tagline")}
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-soil-dark sm:text-5xl">
              {t("heroHeadline")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-soil-light">
              {t("heroBody")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/check"
                className="rounded-xl2 bg-leaf px-6 py-3 font-semibold text-paper shadow-lift transition-transform hover:-translate-y-0.5"
              >
                {t("ctaCheckPrice")} →
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl2 border-2 border-soil/15 px-6 py-3 font-semibold text-soil-dark hover:border-soil/30"
              >
                {t("ctaHowItWorks")}
              </a>
            </div>
          </div>

          <ProfitLadder markets={DEMO_MARKETS} />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-2 font-display text-2xl font-semibold text-soil-dark">
          {t("ctaHowItWorks")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="relative rounded-xl2 border-2 border-soil/10 bg-white p-6 shadow-soft">
              <span className="text-3xl" aria-hidden="true">{step.icon}</span>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-leaf">
                Step {idx + 1}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-soil-dark">
                {t(`${step.key}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-soil-light">
                {t(`${step.key}Body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-soil/10 bg-soil-dark px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
            {t("heroHeadline")}
          </h2>
          <Link
            to="/check"
            className="mt-6 inline-block rounded-xl2 bg-maize px-6 py-3 font-semibold text-soil-dark shadow-lift transition-transform hover:-translate-y-0.5"
          >
            {t("ctaCheckPrice")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
