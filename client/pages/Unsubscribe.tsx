import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/site/SEO";

type Status = "idle" | "submitting" | "done" | "error";

export default function Unsubscribe() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  // Newsletter footers link here with ?email=, so the field arrives filled in.
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get("email") ?? "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email")?.toString().trim();
    if (!email) return;

    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (res.ok && data?.success) {
        setStatus("done");
      } else {
        setStatus("error");
        setMessage(
          data?.error || "We could not process that just now. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "We could not reach the server. Please check your connection and try again.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <SEO
        title="Unsubscribe | Rogers Optimal Health"
        description="Unsubscribe from the Rogers Optimal Health newsletter."
        noindex
      />

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Unsubscribe
      </h1>

      {status === "done" ? (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <p className="font-medium">You've been unsubscribed.</p>
          <p className="mt-1 text-sm">
            You won't receive any more newsletter emails from Rogers Optimal
            Health. It can take a few minutes for this to take effect.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/">Back to the site</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-muted-foreground">
            Enter the email address you subscribed with and we'll remove it from
            the newsletter list.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Email address</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={prefilledEmail}
                placeholder="you@example.com"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>

            {status === "error" && message && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900"
              >
                {message}
              </div>
            )}

            <div>
              <Button type="submit" size="lg" disabled={status === "submitting"}>
                {status === "submitting" ? "Unsubscribing…" : "Unsubscribe"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Having trouble? Email{" "}
            <a
              href="mailto:lenee@rogersoptimalhealth.com?subject=Unsubscribe"
              className="text-primary hover:underline"
            >
              lenee@rogersoptimalhealth.com
            </a>{" "}
            with "Unsubscribe" in the subject line. See our{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
