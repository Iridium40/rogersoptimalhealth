import Disclaimer from "@/components/site/Disclaimer";
import SEO from "@/components/site/SEO";
import { Link } from "react-router-dom";

export default function BlogPortions() {
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
        title="Eating the Right Portions | Rogers Optimal Health"
        description="Simple portion targets to keep you satisfied and on‑plan without the guesswork."
        image="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Eating the Right Portions
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Portion targets keep you fueled without overeating—simple cues help you
        stay consistent.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80"
          alt="Balanced plate with salmon and vegetables"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="prose prose-slate mt-6 max-w-none leading-relaxed prose-p:my-4 prose-p:indent-6 space-y-6">
        <p>
          Portion awareness helps you stay satisfied without
          overeating—especially when your hunger signals are changing on GLP‑1s.
          Think of your plate as a simple framework rather than a strict
          rulebook.
        </p>
        <p>
          A reliable starting point for a Lean & Green is palm‑size{" "}
          <strong>lean protein (5–7 oz cooked)</strong>, a generous serving of
          non‑starchy vegetables (about half the plate), and plan‑appropriate
          healthy fats. Adjust up or down based on energy, goals, and guidance
          from your coach.
        </p>
        <p>
          Hand‑based cues are helpful anywhere: palm = protein, fist = veggies,
          thumb = fats. These visual anchors work at home, at restaurants, and
          while traveling.
        </p>
        <p>
          If measuring once or twice a week helps calibration, use a food scale
          or measuring cups during meal prep. Over time you’ll estimate by sight
          with confidence.
        </p>
        <p>
          Eat slowly and pause at <em>comfortable</em> fullness rather than
          clearing the plate by default. Leftovers make excellent next‑day
          lunches and protect your progress.
        </p>
        <p>
          Dining out? Scan the menu for a protein + veggie combo, ask for sauces
          on the side, and box half if portions are large. Consistency—not
          perfection—wins.
        </p>
        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://www.myplate.gov/" target="_blank" rel="noreferrer">
              USDA — MyPlate
            </a>
          </li>
          <li>
            <a
              href="https://www.dietaryguidelines.gov/"
              target="_blank"
              rel="noreferrer"
            >
              Dietary Guidelines for Americans
            </a>
          </li>
        </ul>
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
