import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "lucide-react";
import InstagramEmbed from "@/components/site/InstagramEmbed";
import SEO from "@/components/site/SEO";

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SEO
        title="Connect with Lenee Rogers | Rogers Optimal Health"
        description="Get in touch with Lenee Rogers for coaching inquiries, OPTAVIA guidance, and support. Connect via social or schedule time."
        image="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F67f507b077de46a0bb2324ea8656430b?format=webp&width=1200"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Connect with Lenee
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Start your journey through OPTAVIA's official system.
      </p>

      <div className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-foreground/80">
          Optavia Coach Profile:{" "}
          <a
            className="text-primary hover:underline"
            href="https://www.optavia.com/us/en/coach//leneerogers"
            target="_blank"
            rel="noreferrer"
          >
            optavia.com//leneerogers
          </a>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="gradient">
            <a
              href={
                import.meta.env.VITE_OPTAVIA_COACH_URL ||
                "https://www.optavia.com/us/en/coach//leneerogers"
              }
              target="_blank"
              rel="noreferrer"
            >
              Connect via OPTAVIA
            </a>
          </Button>
          <Button asChild>
            <a
              href={import.meta.env.VITE_CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
            >
              Book with Lenee
            </a>
          </Button>
        </div>
        <div className="mt-4 text-sm text-foreground/80">
          <span>Social: </span>
          <a
            className="text-primary hover:underline inline-flex items-center gap-1"
            href="https://www.facebook.com/leneebiglane.rogers"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook className="h-4 w-4" /> Facebook
          </a>
          <span className="mx-2">•</span>
          <a
            className="text-primary hover:underline inline-flex items-center gap-1"
            href="https://www.instagram.com/leneerogers/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </div>

      <div className="mt-8">
        <InstagramEmbed permalink="https://www.instagram.com/leneerogers/" />
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 text-xs leading-6 text-muted-foreground">
        <h2 className="text-sm font-semibold text-foreground">Disclaimer</h2>
        <p className="mt-2">
          Information provided is for educational purposes only and is not
          intended to diagnose, treat, cure, or prevent any disease. Consult
          your physician before starting any weight loss, nutrition, or exercise
          program.
        </p>
        <p className="mt-2">
          Results vary based on individual effort, adherence, and health
          history. We do not guarantee specific outcomes.
        </p>
        <p className="mt-2">
          <strong>Website Independence:</strong> This website is independently operated by Lenee Rogers and is not affiliated with, endorsed by, or operated by OPTAVIA LLC. For official OPTAVIA information, please visit optavia.com.
        </p>
      </div>
    </div>
  );
}
