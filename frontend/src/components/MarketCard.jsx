import { useLanguage } from "../context/LanguageContext.jsx";

const TREND_STYLES = {
  rising: { label: "rising", className: "bg-leaf/10 text-leaf" },
  falling: { label: "falling", className: "bg-clay/10 text-clay" },
  stable: { label: "stable", className: "bg-sky/10 text-sky" },
};

export default function MarketCard({ market, isBest }) {
  const { t } = useLanguage();
  const trend = TREND_STYLES[market.trend] || TREND_STYLES.stable;
  const isBroker = market.marketType === "broker";

  return (
    <div
      className={`relative rounded-xl2 border-2 bg-white p-5 transition-shadow ${
        isBest ? "border-maize shadow-lift" : "border-soil/10 shadow-soft"
      }`}
    >
      {isBest && (
        <span className="absolute -top-3 left-5 rounded-full bg-maize px-3 py-1 text-xs font-bold uppercase tracking-wide text-soil-dark shadow-soft">
          ★ {t("bestMarket")}
        </span>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-soil-dark">{market.name}</h3>
          <p className="text-sm text-soil-light">
            {market.county} · {market.distanceKm} km {t("away")}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trend.className}`}>
          {t(trend.label)}
        </span>
      </div>

      <p className="mt-4 font-data text-3xl font-semibold tabular text-soil-dark">
        KSh {market.price.toLocaleString()}
        <span className="ml-1 text-sm font-normal text-soil-light">/{market.unit}</span>
      </p>

      <dl className="mt-4 space-y-1.5 border-t border-soil/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-soil-light">{t("transportEstimate")}</dt>
          <dd className="font-data tabular font-medium text-soil-dark">
            {isBroker ? "—" : `KSh ${market.transportCost.toLocaleString()}`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-soil-light">{t("expectedRevenue")}</dt>
          <dd className="font-data tabular font-medium text-soil-dark">
            KSh {market.revenue.toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between text-base">
          <dt className="font-semibold text-soil-dark">{t("netProfit")}</dt>
          <dd className="font-data tabular font-bold text-leaf">
            KSh {market.netProfit.toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}
