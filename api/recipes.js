const DEFAULT_SOURCE = "https://health-coach-hub.vercel.app/api/public/recipes";

const CATEGORIES = [
  "Chicken",
  "Seafood",
  "Beef",
  "Turkey",
  "Pork",
  "Vegetarian",
  "Breakfast",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function toInt(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
}

/**
 * The hub owns the recipe schema, so normalize defensively here: a shape change
 * upstream should degrade a card, not break the whole page.
 */
function normalize(raw) {
  const counts = raw?.counts || {};
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? "").trim(),
    description: String(raw?.description ?? "").trim(),
    image: typeof raw?.image === "string" ? raw.image : "",
    category: CATEGORIES.includes(raw?.category) ? raw.category : "Chicken",
    prepTime: toInt(raw?.prepTime),
    cookTime: toInt(raw?.cookTime),
    servings: toInt(raw?.servings) || 1,
    difficulty: DIFFICULTIES.includes(raw?.difficulty) ? raw.difficulty : "Easy",
    counts: {
      lean: toInt(counts.lean),
      green: toInt(counts.green),
      fat: toInt(counts.fat),
      condiment: toInt(counts.condiment),
    },
    ingredients: toStringArray(raw?.ingredients),
    instructions: toStringArray(raw?.instructions),
    favoriteCount: toInt(raw?.favoriteCount),
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const source = process.env.RECIPES_SOURCE_URL || DEFAULT_SOURCE;

  try {
    // Proxied server-side: the hub endpoint sends no CORS headers, so the
    // browser cannot call it directly from this origin.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const upstream = await fetch(source, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res
        .status(502)
        .json({ error: `Recipe source returned ${upstream.status}` });
    }

    const payload = await upstream.json();
    const list = Array.isArray(payload) ? payload : payload?.recipes;

    if (!Array.isArray(list)) {
      return res.status(502).json({ error: "Unexpected recipe source format" });
    }

    const recipes = list
      .map(normalize)
      .filter((r) => r.id && r.title && r.image)
      .sort((a, b) => a.title.localeCompare(b.title));

    res.setHeader("Cache-Control", "public, s-maxage=600, max-age=300");
    res.json({ recipes });
  } catch (e) {
    console.error("Recipes route error", e);
    res.status(500).json({ error: "Unable to load recipes" });
  }
}
