import { useLanguage } from "../context/LanguageContext.jsx";

export default function AIRecommendationCard({ loading, recommendation, error }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl2 border-2 border-leaf/30 bg-leaf/5 p-6 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-leaf text-paper">✦</span>
        <h3 className="font-display text-lg font-semibold text-soil-dark">
          {t("aiRecommendation")}
        </h3>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-soil-light" role="status" aria-live="polite">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-leaf border-t-transparent" />
          <span>{t("aiThinking")}</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-clay">{error}</p>
      )}

      {!loading && !error && recommendation && (
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-leaf">
            {recommendation.bestMarketName}
          </p>
          <p className="font-data tabular text-2xl font-bold text-soil-dark">
            KSh {Math.round(recommendation.expectedProfit).toLocaleString()}
          </p>
          <p className="mt-3 leading-relaxed text-soil-dark/90">
            {recommendation.recommendationText}
          </p>
        </div>
      )}
    </div>
  );
}
