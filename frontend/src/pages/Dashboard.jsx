import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { api } from "../services/api.js";
import MarketCard from "../components/MarketCard.jsx";
import ProfitLadder from "../components/ProfitLadder.jsx";
import MapView from "../components/MapView.jsx";
import AIRecommendationCard from "../components/AIRecommendationCard.jsx";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();

  const crop = searchParams.get("crop");
  const quantity = Number(searchParams.get("quantity"));
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const county = searchParams.get("county") || "";

  const [markets, setMarkets] = useState(null);
  const [pricesError, setPricesError] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (!crop || !Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setMarkets(null);
    setPricesError("");
    setRecommendation(null);

    api
      .getPrices({ crop, lat, lng, quantity })
      .then((data) => setMarkets(data.markets))
      .catch((err) => setPricesError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, quantity, lat, lng]);

  useEffect(() => {
    if (!markets || !markets.length) return;

    setAiLoading(true);
    setAiError("");
    api
      .getRecommendation({ crop, quantity, county, markets, language })
      .then((data) => setRecommendation(data.recommendation))
      .catch((err) => setAiError(err.message))
      .finally(() => setAiLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets]);

  if (!crop || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-soil-light">Missing crop or location details.</p>
        <Link to="/check" className="mt-4 inline-block font-semibold text-leaf">
          ← {t("backToForm")}
        </Link>
      </div>
    );
  }

  const bestMarket = markets ? [...markets].sort((a, b) => b.netProfit - a.netProfit)[0] : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
            {crop} · {quantity} bags
          </p>
          <h1 className="font-display text-3xl font-semibold text-soil-dark">
            {t("marketsNearYou")}
          </h1>
          <p className="text-soil-light">{county}</p>
        </div>
        <Link
          to="/check"
          className="rounded-xl2 border-2 border-soil/15 px-4 py-2 text-sm font-semibold text-soil-dark hover:border-soil/30"
        >
          {t("backToForm")}
        </Link>
      </div>

      {pricesError && (
        <div className="rounded-xl2 border-2 border-clay/30 bg-clay/5 p-6 text-clay">
          {pricesError}
        </div>
      )}

      {!pricesError && !markets && (
        <div className="flex items-center gap-3 py-16 text-soil-light" role="status" aria-live="polite">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf border-t-transparent" />
          {t("checking")}
        </div>
      )}

      {markets && markets.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {markets.map((market) => (
                <MarketCard
                  key={market.marketId}
                  market={market}
                  isBest={bestMarket && market.marketId === bestMarket.marketId}
                />
              ))}
            </div>
            <MapView
              farmerLocation={{ latitude: lat, longitude: lng }}
              markets={markets}
              bestMarketId={bestMarket?.marketId}
            />
          </div>

          <div className="space-y-6">
            <AIRecommendationCard loading={aiLoading} recommendation={recommendation} error={aiError} />
            <ProfitLadder markets={markets} />
          </div>
        </div>
      )}
    </div>
  );
}
