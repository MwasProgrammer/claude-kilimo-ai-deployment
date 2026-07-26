import { useLanguage } from "../context/LanguageContext.jsx";

/**
 * The core value of this app is "which market actually pays me more" —
 * so the ranking itself is the visual, not a decorative chart. Bar length
 * is proportional to net profit; rank numbers carry real information here
 * because order is literally what the farmer is paying for.
 */
export default function ProfitLadder({ markets }) {
  const { t } = useLanguage();
  const ranked = [...markets].sort((a, b) => b.netProfit - a.netProfit);
  const max = Math.max(...ranked.map((m) => m.netProfit), 1);

  return (
    <div className="rounded-xl2 border-2 border-soil/10 bg-white p-5 shadow-soft">
      <h3 className="mb-4 font-display text-base font-semibold text-soil-dark">
        {t("profitLadder")}
      </h3>
      <ul className="space-y-3">
        {ranked.map((market, idx) => {
          const widthPct = Math.max(8, (market.netProfit / max) * 100);
          const isBest = idx === 0;
          return (
            <li key={market.marketId ?? market.name} className="flex items-center gap-3">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  isBest ? "bg-maize text-soil-dark" : "bg-soil/10 text-soil-light"
                }`}
              >
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-soil-dark">
                    {market.name}
                  </span>
                  <span className="font-data tabular text-sm font-bold text-soil-dark">
                    KSh {Math.round(market.netProfit).toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-soil/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isBest ? "bg-maize" : "bg-leaf/50"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
