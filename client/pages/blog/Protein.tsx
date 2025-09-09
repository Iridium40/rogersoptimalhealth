import Disclaimer from "@/components/site/Disclaimer";
import SEO from "@/components/site/SEO";
import { Link } from "react-router-dom";

export default function BlogProtein() {
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
        title="Eating Enough Protein | Rogers Optimal Health"
        description="How much protein you need, best sources, and easy ways to hit your target daily."
        image="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=80"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Eating Enough Protein
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Protein helps maintain lean mass, supports satiety, and aids recovery
        during weight loss.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=80"
          alt="High‑protein meal prep with vegetables"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="prose prose-slate mt-6 max-w-none leading-relaxed prose-p:my-4 prose-p:indent-6 space-y-6">
        <p>
          Protein is the building block that helps preserve lean mass, steadies
          appetite, and supports recovery. It’s especially important during
          weight loss and on GLP‑1s when total food volume may be lower.
        </p>
        <p>
          A practical range for many adults is{" "}
          <strong>0.7–1.0 g per pound of goal body weight</strong>, adjusted to
          your plan and medical guidance. Spread intake across the day so each
          meal delivers roughly 20–35 g.
        </p>
        <p>
          Mix sources to cover amino acids and preferences: poultry, fish, lean
          beef, eggs, Greek yogurt, cottage cheese, tofu, tempeh, soy milk, and
          legumes. Plant‑forward eaters can pair foods (e.g., beans + tofu) to
          hit targets.
        </p>
        <p>
          Convenience matters. Keep ready‑to‑eat options on hand: rotisserie
          chicken, tuna packets, pre‑cooked shrimp, egg bites, Greek yogurt
          cups, or shelf‑stable protein shakes that align with your plan.
        </p>
        <p>
          Cook once, eat twice. Batch‑cook proteins (grilled chicken, turkey
          meatballs, baked salmon) and combine with quick vegetables for fast
          weeknight meals. Season generously—herbs and spices make lean choices
          exciting.
        </p>
        <p>
          If appetite is low, start meals with protein first and take small
          bites. Your coach can help personalize the amount as your training,
          goals, or medication dose change.
        </p>
        <h2>Sources</h2>
        <ul>
          <li>
            <a
              href="https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/protein/"
              target="_blank"
              rel="noreferrer"
            >
              Harvard T.H. Chan — The Nutrition Source: Protein
            </a>
          </li>
          <li>
            <a
              href="https://www.myplate.gov/eat-healthy/protein-foods"
              target="_blank"
              rel="noreferrer"
            >
              USDA — Protein Foods Group
            </a>
          </li>
        </ul>
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
