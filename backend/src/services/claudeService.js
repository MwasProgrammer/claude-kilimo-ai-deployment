import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

/**
 * Asks Claude to reason over the computed market options and produce a
 * short, farmer-facing recommendation. All arithmetic (revenue, transport,
 * profit) is computed in JS beforehand — Claude explains and ranks, it
 * doesn't invent numbers.
 */
export async function getAIRecommendation({ crop, quantity, county, markets, language }) {
  if (!anthropic) {
    return fallbackRecommendation(markets, language);
  }

  const langInstruction =
    language === "sw"
      ? "Respond in simple, everyday Kiswahili."
      : "Respond in simple, everyday English.";

  const system = `You are a Kenyan agricultural market advisor speaking directly to a smallholder farmer.
${langInstruction}
You will be given pre-calculated numbers for each market option (price, distance, transport cost, expected net profit). Do not recalculate or alter these numbers — use them exactly as given.
Reply with ONLY a JSON object, no markdown fences, no preamble, matching this shape:
{"bestMarketName": string, "expectedProfit": number, "shouldWait": boolean, "recommendationText": string}
"recommendationText" must be 2-4 short sentences: name the best market, state the profit advantage over the lowest option (usually the broker), mention the price trend, and give a clear sell-now-or-wait call.`;

  const user = `Crop: ${crop}
Quantity: ${quantity} bags
Farmer location: ${county}
Market options (already computed):
${markets
  .map(
    (m) =>
      `- ${m.name} (${m.county}): price KSh ${m.price}/bag, ${m.distanceKm.toFixed(
        0
      )} km away, transport KSh ${m.transportCost}, net profit KSh ${m.netProfit}, trend: ${m.trend}`
  )
  .join("\n")}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  try {
    const cleaned = text.replace(/^```json|```$/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[claudeService] Failed to parse Claude response as JSON:", text);
    return fallbackRecommendation(markets, language);
  }
}

/** Used if ANTHROPIC_API_KEY is missing or Claude's response can't be parsed. */
function fallbackRecommendation(markets, language) {
  const best = [...markets].sort((a, b) => b.netProfit - a.netProfit)[0];
  const worst = [...markets].sort((a, b) => a.netProfit - b.netProfit)[0];
  const gain = Math.round(best.netProfit - worst.netProfit);

  const recommendationText =
    language === "sw"
      ? `Soko bora ni ${best.name}, ambako unaweza kupata faida ya ziada ya KSh ${gain.toLocaleString()} ukilinganisha na chaguo la chini kabisa. Bei zinaonekana ${best.trend === "rising" ? "kupanda" : "thabiti"}.`
      : `${best.name} is your best option, offering about KSh ${gain.toLocaleString()} more profit than the lowest option. Prices there look ${best.trend === "rising" ? "like they're rising" : "stable"} right now.`;

  return {
    bestMarketName: best.name,
    expectedProfit: Math.round(best.netProfit),
    shouldWait: best.trend === "rising",
    recommendationText,
  };
}
