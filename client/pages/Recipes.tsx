import { useEffect, useMemo, useState } from "react";
import type { Recipe, RecipeCategory, RecipesResponse } from "@shared/api";

const CATEGORIES: RecipeCategory[] = [
  "Chicken",
  "Seafood",
  "Beef",
  "Turkey",
  "Pork",
  "Vegetarian",
  "Breakfast",
];

const PAGE_SIZE = 12;

function CountBadges({ counts }: { counts: Recipe["counts"] }) {
  const items = [
    { label: "Lean", value: counts.lean },
    { label: "Green", value: counts.green },
    { label: "Fat", value: counts.fat },
    { label: "Condiment", value: counts.condiment },
  ].filter((i) => i.value > 0);

  if (!items.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span
          key={i.label}
          className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
        >
          {i.value} {i.label}
        </span>
      ))}
    </div>
  );
}

function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.title}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close recipe"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-lg shadow hover:bg-secondary"
        >
          ×
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-muted">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {recipe.category}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            {recipe.title}
          </h2>
          {recipe.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>Prep {recipe.prepTime} min</span>
            <span>Cook {recipe.cookTime} min</span>
            <span>Serves {recipe.servings}</span>
            <span>{recipe.difficulty}</span>
          </div>

          <CountBadges counts={recipe.counts} />

          {recipe.ingredients.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Ingredients</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Instructions</h3>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-foreground/80">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
            Follow your specific Trilivy plan guidelines. Consult with your coach
            for personalized meal planning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<RecipeCategory | "All">("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch("/api/recipes", {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as RecipesResponse | { error: string };
        if (!("recipes" in data)) throw new Error("Unable to load recipes");

        if (mounted) {
          setRecipes(data.recipes);
          setError(data.recipes.length ? null : "No recipes available yet.");
        }
      } catch (e: any) {
        if (mounted && e?.name !== "AbortError") {
          setError("Unable to load recipes right now. Please try again later.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const available = useMemo(() => {
    const present = new Set((recipes || []).map((r) => r.category));
    return CATEGORIES.filter((c) => present.has(c));
  }, [recipes]);

  const filtered = useMemo(() => {
    if (!recipes) return [];
    return category === "All"
      ? recipes
      : recipes.filter((r) => r.category === category);
  }, [recipes, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Lean &amp; Green Recipe Ideas
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Coach-curated recipes with Lean &amp; Green counts for every serving.
        Always follow your specific Trilivy plan guidelines.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-muted-foreground">Loading recipes…</p>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      )}

      {recipes && recipes.length > 0 && (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {(["All", ...available] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c as RecipeCategory | "All");
                  setVisible(PAGE_SIZE);
                }}
                className={
                  "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors " +
                  (category === c
                    ? "border-primary bg-primary text-white"
                    : "hover:bg-secondary")
                }
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="group rounded-2xl border bg-card p-2 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={r.image}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {r.category}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.prepTime + r.cookTime} min · Serves {r.servings}
                  </p>
                  <CountBadges counts={r.counts} />
                </div>
              </button>
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() =>
                  setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length))
                }
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-secondary"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-10 rounded-2xl border bg-white p-4 text-xs text-muted-foreground">
        Follow your specific Trilivy plan guidelines. Consult with your coach for
        personalized meal planning.
      </div>

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
