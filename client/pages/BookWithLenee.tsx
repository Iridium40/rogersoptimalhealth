import { useMemo } from "react";

export default function BookWithLenee() {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL as string | undefined;
  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,theme(colors.secondary/60),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Book with Lenee
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Schedule a time that works best for you. Your current timezone: {tz}
          </p>

          <div className="mt-8 w-full overflow-hidden rounded-xl border bg-card p-2 shadow-sm">
            {!calendlyUrl ? (
              <div className="p-6 text-sm text-muted-foreground">
                Booking is temporarily unavailable. Please try again later or
                use the contact page.
              </div>
            ) : (
              <iframe
                title="Book with Lenee — Calendly"
                src={calendlyUrl}
                className="h-[720px] w-full rounded-lg"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
