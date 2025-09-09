import { useEffect, useRef } from "react";

interface InstagramEmbedProps {
  permalink: string; // e.g. https://www.instagram.com/leneerogers/
}

export default function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ensureScript = () =>
      new Promise<void>((resolve) => {
        // If script already present, resolve and re-process
        if ((window as any).instgrm && (window as any).instgrm.Embeds) {
          resolve();
          return;
        }
        const existing = document.querySelector<HTMLScriptElement>(
          'script[src="https://www.instagram.com/embed.js"]',
        );
        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }
        const s = document.createElement("script");
        s.async = true;
        s.src = "https://www.instagram.com/embed.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    ensureScript().then(() => {
      try {
        (window as any).instgrm?.Embeds?.process();
      } catch {}
    });
  }, [permalink]);

  return (
    <div ref={ref} className="w-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`${permalink}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 12,
          boxShadow: "0 1px 10px rgba(0,0,0,0.12)",
          margin: "0 auto",
          maxWidth: 540,
          minWidth: 326,
          width: "100%",
        }}
      >
        <a
          href={`${permalink}?utm_source=ig_embed&utm_campaign=loading`}
          target="_blank"
          rel="noreferrer"
        >
          View on Instagram
        </a>
      </blockquote>
    </div>
  );
}
