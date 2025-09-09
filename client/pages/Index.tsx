import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/site/Disclaimer";
import { Instagram, Heart, Utensils, Users, Target } from "lucide-react";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_40%_at_50%_-10%,theme(colors.secondary/70),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Hi, I'm Lenee Rogers — Your Independent OPTAVIA Certified Health
              Coach
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to transform your relationship with food and find the energy
              to be your best self?
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow" variant="gradient">
                <a
                  href={
                    import.meta.env.VITE_OPTAVIA_COACH_URL ||
                    "https://www.optavia.com/us/en/coach//leneerogers"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Start Your Journey
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/my-story">Read My Story</Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2">
              {[
                "Personalized one-on-one coaching",
                "Proven Optavia program results",
                "Ongoing support and accountability",
                "Flexible online coaching sessions",
                "Safe, supportive environment",
                "GLP-1 support and guidance",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border bg-white/60 px-4 py-3"
                >
                  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-secondary p-1 shadow-sm">
              <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.primary/10),transparent_50%,theme(colors.accent/10))]" />
              <div className="grid h-full place-items-center rounded-xl bg-white/70 backdrop-blur">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src="https://cdn.builder.io/o/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F79af2e9d675c4612881ad4e31a21d56e?alt=media&token=5992b69c-4b7c-4626-b11a-3ff3fd9133bd&apiKey=a42b6f9ec53e4654a92af75aad56d14f"
                      alt="Lenee Rogers"
                      className="mx-auto h-64 w-auto rounded-xl"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F67f507b077de46a0bb2324ea8656430b?format=webp&width=800"
                      alt="Rogers Optimal Health badge"
                      className="absolute -top-8 -right-8 h-16 w-16 rounded-full border-2 border-white shadow-md"
                    />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Coaching by
                  </p>
                  <p className="text-2xl font-bold">Lenee Rogers</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Independent OPTAVIA Certified Health Coach
                  </p>
                  <div className="mt-3 text-sm">
                    <a
                      href="https://www.instagram.com/leneerogers/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Instagram className="h-4 w-4" /> Follow me on Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight">How I Help</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Simple, sustainable strategies tailored to your life—backed by a
          proven program and compassionate accountability.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Health Coaching",
              desc: "Weekly check-ins, personalized guidance, and habit building.",
              icon: Heart,
            },
            {
              title: "Meal Planning & Recipes",
              desc: "Lean & Green meals, shopping lists, and prep tips.",
              icon: Utensils,
            },
            {
              title: "Accountability & Support",
              desc: "Motivation, mindset, and steady progress tracking.",
              icon: Users,
            },
            {
              title: "Habit Formation",
              desc: "Small changes that compound into life-long health.",
              icon: Target,
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <s.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Preview */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight">Lenee's Story</h2>
        <ul className="mt-3 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
          <li>
            <span className="font-semibold">Passionate Health Advocate:</span>{" "}
            Empowers individuals with sustainable habits for overall well‑being.
          </li>
          <li>
            <span className="font-semibold">Holistic Health Believer:</span>{" "}
            Guides clients toward optimal physical and mental wellness.
          </li>
          <li>
            <span className="font-semibold">Personalized Approach:</span>{" "}
            Tailors realistic, achievable plans to each unique journey.
          </li>
          <li>
            <span className="font-semibold">Optavia Expertise:</span> Uses a
            clinically proven plan and fuelings to support transformation.
          </li>
          <li className="sm:col-span-2">
            <span className="font-semibold">Coaching Philosophy:</span>{" "}
            Compassion, accountability, and motivation for lasting change.
          </li>
        </ul>
        <div className="mt-4">
          <Link to="/my-story" className="text-primary hover:underline">
            Read more about Lenee
          </Link>
        </div>
      </section>

      {/* Why OPTAVIA Works */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight">Why OPTAVIA Works</h2>
        <ul className="mt-4 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Average weight loss on the Optimal Weight 5 & 1 Plan® is 12 pounds*
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            More than 3 million lives impacted and counting
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Clinically proven nutrition plans
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Support from your personal coach and community
          </li>
        </ul>
      </section>

      {/* What You Get */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight">What You Get</h2>
        <ul className="mt-4 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Personal coach support (Lenee)
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Supportive community
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Science‑backed nutrition plans
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Lean & Green meal guidance
          </li>
          <li className="rounded-lg border bg-white/60 px-4 py-3">
            Access to GLP‑1 options (if clinically appropriate)*
          </li>
        </ul>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-6 rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center shadow-sm md:grid-cols-2 md:text-left">
          <div>
            <h3 className="text-2xl font-bold">Have more questions?</h3>
            <p className="mt-2 text-muted-foreground">
              Book time with me and I'll answer all of your questions.
            </p>
          </div>
          <div className="md:text-right">
            <Button asChild size="lg" className="shadow" variant="gradient">
              <a
                href="https://calendly.com/leneerogers/15min"
                target="_blank"
                rel="noreferrer"
              >
                Book with Lenee
              </a>
            </Button>
          </div>
        </div>
        <Disclaimer className="mt-6" />
      </section>
    </div>
  );
}
