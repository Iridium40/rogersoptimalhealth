import Disclaimer from "@/components/site/Disclaimer";

import { Link } from "react-router-dom";
import { posts } from "@/pages/blog/posts";
import ShareButton from "@/components/site/ShareButton";
import SEO from "@/components/site/SEO";

export default function WhyCoaching() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO
        title="Client Support | Rogers Optimal Health"
        description="Success tips for the 5 & 1 Plan, hydration guidance, and practical coaching resources curated by Lenee Rogers."
        image="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F67f507b077de46a0bb2324ea8656430b?format=webp&width=1200"
      />
      <div className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Client Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Practical tips for success on OPTAVIA's Optimal Weight 5 & 1 Plan®,
          hydration guidance, and coaching resources—everything in one place.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <a
            href={import.meta.env.VITE_CALENDLY_URL}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-white shadow hover:opacity-95"
          >
            Book with Lenee
          </a>
          <ShareButton
            buttonLabel="Share Client Support"
            size="sm"
            title="Client Support | WellSmith"
            description="Tips for success on the 5 & 1 Plan, hydration guidance, and resources."
          />
        </div>
      </div>

      {/* Client Success */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">Success Tips for the 5 & 1 Plan</h2>
          <ul className="mt-3 grid gap-2 text-sm text-foreground/80">
            <li>
              Eat all 5 fuelings plus 1 Lean & Green—set reminders if needed.
            </li>
            <li>
              Keep Lean & Green simple: 5–7 oz lean protein + 3 servings
              non‑starchy veggies.
            </li>
            <li>
              Limit extras: up to 2 condiments and 2 healthy fats when your plan
              calls for them.
            </li>
            <li>
              Check in daily with your coach; track sleep, water, movement, and
              mindset.
            </li>
            <li>
              Gentle movement and consistent sleep help—reset at the next
              fueling if you slip.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold">Hydration Guide</h2>
          <ul className="mt-3 grid gap-2 text-sm text-foreground/80">
            <li>
              Target 64+ oz daily; many do well at ~½ body‑weight (oz). Spread
              it through the day.
            </li>
            <li>
              Start your morning with 8–16 oz; use a reusable bottle to track
              progress.
            </li>
            <li>
              Consider electrolytes if needed; limit caffeine and avoid sugary
              beverages.
            </li>
            <li>
              Watch for dehydration signs: headache, fatigue, dark
              urine—increase water as needed.
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold tracking-tight">
        Health and Wellness Information
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Articles on GLP‑1 support, hydration, sleep, portions, protein, and
        more.
      </p>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {posts.slice(0, 6).map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
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
            <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {p.excerpt}
            </p>
            <p className="text-xs text-muted-foreground">Read more →</p>
          </Link>
        ))}
      </div>
      <Disclaimer className="mt-10" />
    </div>
  );
}
