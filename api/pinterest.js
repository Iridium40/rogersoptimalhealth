import { XMLParser } from "fast-xml-parser";

function toRssUrl(url) {
  const u = url.trim();
  if (u.endsWith(".rss")) return u;
  return u.replace(/\/$/, "") + ".rss";
}

function getBoardPath(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    if (!path || path.split("/").length < 2) return null;
    return path;
  } catch {
    return null;
  }
}

async function fetchWidgetPins(boardUrl) {
  const path = getBoardPath(boardUrl);
  if (!path) return [];
  const api = `https://widgets.pinterest.com/v3/pidgets/boards/${path}/pins/`;
  const r = await fetch(api, {
    headers: {
      "user-agent": "WellSmithBot/1.0",
      accept: "application/json,text/javascript,*/*;q=0.1",
      referer: "https://www.pinterest.com/",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  if (!r.ok) return [];
  const j = (await r.json().catch(() => null));
  const pinsRaw = j?.data?.pins || [];
  const pickImage = (images) => {
    if (!images) return undefined;
    const keys = Object.keys(images).sort((a, b) => parseInt(b) - parseInt(a));
    for (const k of ["736x", "564x", "474x", ...keys]) {
      const u = images?.[k]?.url;
      if (typeof u === "string") return u;
    }
    return images?.orig?.url || images?.["236x"]?.url;
  };
  return pinsRaw
    .map((p) => {
      const id = p?.id || p?.pin_id;
      const link = id ? `https://www.pinterest.com/pin/${id}/` : p?.link;
      const image = pickImage(p?.images) || "";
      const title = (p?.grid_title || p?.title || "").toString().trim();
      const description = (p?.grid_description || p?.description || "")
        .toString()
        .trim();
      return { title, description, link, image };
    })
    .filter((p) => !!p.link);
}

function textFromHtml(html) {
  if (typeof html !== "string") return "";
  const withoutTags = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return withoutTags;
}

function extractImageFromItem(item) {
  const media = item["media:content"] || item.mediaContent || item.media || undefined;
  if (media) {
    if (Array.isArray(media)) {
      for (const m of media) {
        const url = m?.["@_url"] || m?.url;
        if (typeof url === "string") return url;
      }
    } else {
      const url = media?.["@_url"] || media?.url;
      if (typeof url === "string") return url;
    }
  }

  const enclosure = item.enclosure;
  if (enclosure) {
    if (Array.isArray(enclosure)) {
      for (const e of enclosure) {
        const url = e?.["@_url"] || e?.url;
        if (typeof url === "string") return url;
      }
    } else {
      const url = enclosure?.["@_url"] || enclosure?.url;
      if (typeof url === "string") return url;
    }
  }

  const thumb = item["media:thumbnail"] || item.mediaThumbnail;
  if (thumb) {
    if (Array.isArray(thumb)) {
      for (const t of thumb) {
        const url = t?.["@_url"] || t?.url;
        if (typeof url === "string") return url;
      }
    } else {
      const url = thumb?.["@_url"] || thumb?.url;
      if (typeof url === "string") return url;
    }
  }

  const html = item["content:encoded"] || item.content || item.description || "";
  if (typeof html === "string") {
    const srcset = html.match(/<img[^>]+srcset=["']([^"']+)["']/i);
    if (srcset) {
      const first = srcset[1].split(",")[0]?.trim().split(" ")[0];
      if (first) return first;
    }
    const imgTag = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgTag) return imgTag[1];
    const dataMedia = html.match(/data-pin-media=["']([^"']+)["']/i);
    if (dataMedia) return dataMedia[1];
  }

  return undefined;
}

function extractLinkFromItem(item) {
  const val = item?.link;
  const toStr = (v) =>
    typeof v === "string"
      ? v
      : typeof v?.["#text"] === "string"
        ? v["#text"]
        : undefined;
  let link = toStr(val);
  if (!link) link = toStr(item?.guid);

  if (link && !/^https?:\/\//i.test(link)) {
    const id = (link.match(/[A-Za-z0-9_-]+/) || [""])[0];
    if (id) link = `https://www.pinterest.com/pin/${id}/`;
  }

  if (!link) {
    const html = item?.["content:encoded"] || item?.content || item?.description || "";
    if (typeof html === "string") {
      const m = html.match(
        /href=["'](https?:\/\/[^"']+pinterest\.com\/pin\/[^"']+)["']/i,
      );
      if (m) link = m[1];
    }
  }
  return link;
}

function extractDescriptionFromItem(item) {
  const html = item?.description || item?.["content:encoded"] || item?.content || "";
  const text = textFromHtml(
    typeof html === "string" ? html : String(html?.["#text"] ?? ""),
  );
  return text || undefined;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const board = req.query.board || process.env.PINTEREST_BOARD_URL;
    if (!board) {
      return res.status(400).json({
        error: "Missing Pinterest board URL. Provide ?board= or set PINTEREST_BOARD_URL.",
      });
    }
    const rssUrl = toRssUrl(board);

    let items = [];
    try {
      const r = await fetch(rssUrl, {
        headers: {
          "user-agent": "WellSmithBot/1.0",
          accept: "application/rss+xml, text/xml; q=0.9, */*;q=0.8",
        },
      });
      if (r.ok) {
        const xml = await r.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const data = parser.parse(xml);

        const toArray = (v) => Array.isArray(v) ? v : v ? [v] : [];

        if (data?.rss) {
          const ch = data.rss.channel;
          if (Array.isArray(ch)) {
            for (const c of ch) items.push(...toArray(c?.item));
          } else {
            items = toArray(ch?.item);
          }
        } else if (data?.["rdf:RDF"]) {
          items = toArray(data["rdf:RDF"].item);
        } else if (data?.feed) {
          items = toArray(data.feed.entry).map((e) => ({
            title: e?.title?.["#text"] || e?.title || "",
            link: e?.link?.["@_href"] || e?.link || "",
            content: e?.content?.["#text"] || e?.content || "",
          }));
        }
      }
    } catch {
      // ignore RSS errors and try widget fallback below
    }

    let pins = items
      .map((it) => {
        let title = (
          typeof it?.title === "string"
            ? it.title
            : String(it?.title?.["#text"] ?? "")
        ).trim();
        const link = extractLinkFromItem(it) || "";
        const image = extractImageFromItem(it) || "";
        const description = (extractDescriptionFromItem(it) || "").trim();
        if (!title && description) title = description.slice(0, 80);
        return { title, description, link, image };
      })
      .filter((p) => !!p.link);

    res.setHeader("Cache-Control", "public, s-maxage=300, max-age=120");

    let finalPins = pins;
    if (finalPins.length < 6) {
      const boardUrl = req.query.board || process.env.PINTEREST_BOARD_URL || "";
      const widgetPins = await fetchWidgetPins(boardUrl).catch(() => []);
      if (widgetPins.length) {
        const seen = new Set();
        finalPins = [...finalPins, ...widgetPins].filter((p) => {
          if (!p.link || seen.has(p.link)) return false;
          seen.add(p.link);
          return true;
        });
      }
    }

    finalPins = finalPins
      .map((p) => ({
        ...p,
        title: p.title?.trim() || p.description?.slice(0, 80) || "Recipe",
        description: p.description || p.title || "",
      }))
      .filter((p) => !!p.image && !!p.link);

    const resp = { pins: finalPins };
    res.json(resp);
  } catch (e) {
    console.error("Pinterest route error", e);
    res.status(500).json({ error: "Internal error" });
  }
}
