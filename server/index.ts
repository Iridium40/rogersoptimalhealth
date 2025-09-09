import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleHealthAssessment } from "./routes/health-assessment";
import { handlePinterest } from "./routes/pinterest";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Health Assessment form submission
  app.post("/api/health-assessment", handleHealthAssessment);

  // Pinterest images (Lean & Green) from public board RSS
  app.get("/api/pinterest", handlePinterest);

  // Sitemap
  app.get("/sitemap.xml", (_req, res) => {
    const routes = [
      "/",
      "/about",
      "/program",
      "/faqs",
      "/recipes",
      "/connect",
      "/book-assessment",
      "/my-story",
      "/why-coaching",
      "/book-with-kayce",
      "/get-started",
      "/privacy",

      "/blog/eating-right-on-glp1",
      "/blog/drinking-enough-water",
      "/blog/getting-enough-sleep",
      "/blog/right-portions",
      "/blog/enough-protein",
      "/blog/meditation-healthy-movement",
    ];
    const host = (
      _req.headers["x-forwarded-host"] ||
      _req.headers.host ||
      ""
    ).toString();
    const proto = (_req.headers["x-forwarded-proto"] || "https").toString();
    const base = host ? `${proto}://${host}` : "";
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      routes
        .map(
          (p) =>
            `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`,
        )
        .join("") +
      `</urlset>`;
    res.set("Content-Type", "application/xml").send(xml);
  });

  return app;
}
