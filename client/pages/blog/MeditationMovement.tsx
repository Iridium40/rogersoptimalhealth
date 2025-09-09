import Disclaimer from "@/components/site/Disclaimer";
import SEO from "@/components/site/SEO";
import { Link } from "react-router-dom";

export default function BlogMeditationMovement() {
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
        title="Meditation and Healthy Movement | Rogers Optimal Health"
        description="Reduce stress and build consistent movement with short, sustainable practices and breathwork."
        image="https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&w=1400&q=80"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Meditation and Healthy Movement
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Calm your nervous system and build momentum with gentle, sustainable
        movement habits.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&w=1400&q=80"
          alt="Person meditating outdoors at sunrise"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="prose prose-slate mt-6 max-w-none leading-relaxed prose-p:my-4 prose-p:indent-6 space-y-6">
        <p>
          A calmer nervous system makes behavior change easier. Begin with 2–5
          minutes of diaphragmatic breathing or a simple box breath (inhale 4,
          hold 4, exhale 4, hold 4). Even one short session can reduce
          stress‑eating cues and help you transition between parts of your day.
        </p>
        <p>
          Try “micro‑meditations” throughout the day: three slow breaths before
          opening email, a one‑minute pause in the car before heading into the
          house, or a brief body‑scan after lunch. Frequency matters more than
          length.
        </p>
        <p>
          For movement, consistency beats intensity. Aim for low‑to‑moderate
          activity most days—brisk walking, light strength, yoga, or mobility
          flows. Many people feel great building to 6–10k steps daily with a few
          short walks rather than one long session.
        </p>
        <p>
          Add a minimal effective dose of strength training 2–3 days a week.
          Focus on big movements—squats, hinges, pushes, pulls—with 1–2 sets
          done well. Preserving muscle supports metabolism, posture, and
          confidence.
        </p>
        <p>
          Habit‑stacking makes it stick: stretch while the coffee brews, do 10
          air squats after bathroom breaks, or take a 10‑minute walk after
          dinner. Tie the behavior to an existing routine so it happens
          automatically.
        </p>
        <p>
          Recovery is part of training. Gentle stretching, yoga nidra, and
          quality sleep lower stress and help your body adapt. Progress comes
          from repeating small, sustainable actions—not pushing to exhaustion.
        </p>
        <h2>Sources</h2>
        <ul>
          <li>
            <a
              href="https://www.nccih.nih.gov/health/meditation-in-depth"
              target="_blank"
              rel="noreferrer"
            >
              NIH NCCIH — Meditation: In Depth
            </a>
          </li>
          <li>
            <a
              href="https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines"
              target="_blank"
              rel="noreferrer"
            >
              U.S. Physical Activity Guidelines
            </a>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noreferrer">
              American College of Sports Medicine
            </a>
          </li>
        </ul>
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
