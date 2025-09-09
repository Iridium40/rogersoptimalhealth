import Disclaimer from "@/components/site/Disclaimer";
import SEO from "@/components/site/SEO";
import { Link } from "react-router-dom";

export default function BlogSleep() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-4">
        <Link
          to="/why-coaching"
          className="text-sm text-primary hover:underline"
        >
          ← Back to Client Support
        </Link>
      </div>
      <SEO
        title="Getting Enough Sleep | Rogers Optimal Health"
        description="Sleep quality influences hunger hormones, recovery, and weight management. Practical tips for better rest."
        image="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F155c7ececc0848188255f02e0c732cc6?format=webp&width=1200"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Getting Enough Sleep
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Sleep quality influences hunger hormones, recovery, and weight
        management.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F155c7ececc0848188255f02e0c732cc6?format=webp&width=800"
          alt="Cozy bed for restful sleep"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="prose prose-slate mt-6 max-w-none leading-relaxed prose-p:my-4 prose-p:indent-6 space-y-6">
        <p>
          Better sleep improves appetite hormones, mood, and recovery—making
          healthy choices much easier the next day. On GLP‑1s, consistent sleep
          can also reduce nausea and support steady energy.
        </p>
        <p>
          Build a wind‑down routine 30–60 minutes before bed: dim lights, close
          laptops, and park your phone. Light stretching, reading, or a warm
          shower signals your body that sleep is coming.
        </p>
        <p>
          Aim for <strong>7–9 hours</strong> for most adults. Wake and sleep
          around the same time daily, even on weekends, to anchor your circadian
          rhythm. A short morning walk in daylight can reinforce that rhythm.
        </p>
        <p>
          Set the environment: keep the bedroom cool, dark, and quiet. Use
          blackout shades or an eye mask and consider a fan or white‑noise app
          if sounds wake you.
        </p>
        <p>
          Caffeine after midday and alcohol close to bedtime can fragment sleep.
          If you enjoy either, experiment with timing so you can fall—and
          stay—asleep more easily.
        </p>
        <p>
          Naps are fine when you need them; cap them at ~20–30 minutes and avoid
          late‑evening naps that make it harder to fall asleep at night.
        </p>
        <h2>Sources</h2>
        <ul>
          <li>
            <a
              href="https://www.cdc.gov/sleep/about_sleep/how_much_sleep.html"
              target="_blank"
              rel="noreferrer"
            >
              CDC — How Much Sleep Do I Need?
            </a>
          </li>
          <li>
            <a href="https://aasm.org/" target="_blank" rel="noreferrer">
              American Academy of Sleep Medicine — Sleep Guidelines & Resources
            </a>
          </li>
        </ul>
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
