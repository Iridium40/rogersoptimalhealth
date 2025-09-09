import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ProgramOverview() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_40%_at_50%_-10%,theme(colors.secondary/60),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Program Overview
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            The Optavia approach pairs a scientifically designed nutrition plan
            with daily coaching and community support. Here's what working
            together looks like.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "1. Personal Assessment",
                desc: "We review your goals, health history, and lifestyle to craft a simple plan.",
              },
              {
                title: "2. Structured Fueling",
                desc: "Follow a predictable daily routine with meals and Lean & Green choices.",
              },
              {
                title: "3. Daily Coaching",
                desc: "Light-touch check‑ins to keep you accountable and supported every day.",
              },
              {
                title: "4. Habits of Health",
                desc: "Build sustainable habits around sleep, hydration, movement, and mindset.",
              },
              {
                title: "5. Transition & Maintenance",
                desc: "We gradually add flexibility while protecting your results long‑term.",
              },
              {
                title: "6. Community",
                desc: "Access resources, recipes, and a supportive network for ongoing success.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent" />
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">What's Included</h2>
              <ul className="mt-3 grid gap-2 text-sm text-foreground/80">
                {[
                  "Customized plan with clear daily routine",
                  "Weekly coach call + daily text support",
                  "Progress tracking and milestone reviews",
                  "Lean & Green recipes and shopping guides",
                  "Transition roadmap and maintenance playbook",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />{" "}
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">Who It's For</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Busy professionals, parents, and anyone wanting a proven, guided
                path to a healthy weight, higher energy, and stronger habits.
              </p>
              <div className="mt-4">
                <Button asChild size="lg">
                  <Link to="/book-assessment#health-assessment">
                    Start Health Assessment
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
