import { useEffect, useState } from "react";
import type { PinterestResponse, PinterestPin } from "@shared/api";

export default function Recipes() {
  const [pins, setPins] = useState<PinterestPin[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(12);

  useEffect(() => {
    let mounted = true;

    async function fetchWithRetry(
      input: RequestInfo | URL,
      init?: RequestInit,
      attempts = 3,
    ): Promise<Response> {
      let lastErr: any;
      for (let i = 0; i < attempts; i++) {
        try {
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), 10000);
          const res = await fetch(input, {
            ...init,
            cache: "no-store",
            signal: controller.signal,
          });
          clearTimeout(t);
          if (res.ok) return res;
          lastErr = new Error(`HTTP ${res.status}`);
        } catch (err) {
          lastErr = err;
        }
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
      throw lastErr || new Error("Failed to fetch");
    }

    (async () => {
      try {
        setLoading(true);
        const endpoints = ["/api/pinterest"];
        let data: PinterestResponse | { error: string } | null = null;
        let lastErr: any;
        try {
          for (const url of endpoints) {
            try {
              const res = await fetchWithRetry(url);
              data = (await res.json()) as
                | PinterestResponse
                | { error: string };
              if ("pins" in data) break;
            } catch (err) {
              lastErr = err;
            }
          }
        } catch (e) {
          lastErr = e;
        }

        // Always attempt widget fallback if we don't have usable data
        if (
          !data ||
          !("pins" in data) ||
          !(data as PinterestResponse).pins?.length
        ) {
          const toPath = (u: string) => {
            try {
              const { pathname } = new URL(u);
              return pathname.replace(/^\/+|\/+$/g, "");
            } catch {
              return "";
            }
          };
          const fallbackBoard = "https://www.pinterest.com/optavia/lean-green/";
          const path = toPath(fallbackBoard);
          if (path) {
            try {
              const widgetRes = await fetchWithRetry(
                `https://widgets.pinterest.com/v3/pidgets/boards/${path}/pins/`,
                { mode: "cors" },
              );
              const widgetJson = (await widgetRes.json()) as any;
              const pins = (widgetJson?.data?.pins || []).map((p: any) => ({
                title: String(p?.grid_title || p?.title || "").trim(),
                description: String(
                  p?.grid_description || p?.description || "",
                ).trim(),
                link: p?.id
                  ? `https://www.pinterest.com/pin/${p.id}/`
                  : String(p?.link || ""),
                image:
                  p?.images?.["736x"]?.url ||
                  p?.images?.["564x"]?.url ||
                  p?.images?.["474x"]?.url ||
                  p?.images?.orig?.url ||
                  p?.images?.["236x"]?.url ||
                  "",
              }));
              data = { pins } as PinterestResponse;
            } catch (err) {
              lastErr = err;
            }
          }
        }

        if (!data || !("pins" in data))
          throw lastErr || new Error("Unable to load");

        if (mounted) {
          const list = (data as PinterestResponse).pins
            .map((p) => ({
              ...p,
              title: p.title?.trim() || p.description?.slice(0, 80) || "Recipe",
              description: p.description || p.title || "",
            }))
            .filter((p) => !!p.image && !!p.link);
          setPins(list);
          setError(
            list.length ? null : "No recipes found from Pinterest board.",
          );
        }
      } catch (e: any) {
        if (mounted)
          setError(e?.message || "Unable to load recipes. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Lean & Green Recipe Ideas
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Ideas pulled from a public Pinterest board. Always follow your specific
        OPTAVIA plan guidelines.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-muted-foreground">Loading recipes…</p>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
          {!pins?.length && (
            <>
              {" "}
              If this persists, ensure the public board URL is set via the
              PINTEREST_BOARD_URL environment variable.
            </>
          )}
        </div>
      )}

      {pins && (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pins.slice(0, visible).map((p, i) => (
              <a
                key={p.link + i}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border bg-card p-2 shadow-sm"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-medium">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {p.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  View on Pinterest
                </p>
              </a>
            ))}
          </div>
          {visible < pins.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisible((v) => Math.min(v + 12, pins.length))}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-secondary"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
      <div className="mt-10 rounded-2xl border bg-white p-4 text-xs text-muted-foreground">
        Follow your specific OPTAVIA plan guidelines. Consult with your coach
        for personalized meal planning.
      </div>
    </div>
  );
}
