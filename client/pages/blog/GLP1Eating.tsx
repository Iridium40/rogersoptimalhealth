import Disclaimer from "@/components/site/Disclaimer";
import SEO from "@/components/site/SEO";
import { Link } from "react-router-dom";

export default function BlogGLP1Eating() {
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
        title="Eating Right on GLP‑1s | Rogers Optimal Health"
        description="Strategies to feel your best, support muscle, and avoid common pitfalls while using GLP‑1 medications."
        image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Eating Right on GLP‑1s
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Strategies to feel your best, support muscle, and avoid common pitfalls
        while using GLP‑1 medications.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80"
          alt="Colorful bowl with lean protein and vegetables"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="prose prose-slate mt-6 max-w-none leading-relaxed prose-p:my-4 prose-p:indent-6 space-y-6">
        <p>
          GLP‑1 medications often reduce hunger and slow gastric emptying. That
          can be helpful for weight loss, but it also means nutrition quality
          matters more than ever. Your goal is to nourish well on smaller
          portions so you protect lean muscle, maintain energy, and feel your
          best.
        </p>
        <p>
          Start by prioritizing protein at each meal. Most adults do well aiming
          for
          <strong>20–35 grams</strong> per meal from options like chicken, fish,
          turkey, eggs, Greek yogurt, cottage cheese, tofu, or tempeh. Protein
          supports satiety and helps preserve lean mass when body weight is
          trending down.
        </p>
        <p>
          Fill the rest of your plate with non‑starchy vegetables—think leafy
          greens, peppers, zucchini, broccoli, and cauliflower. These add fiber,
          water, and micronutrients without many calories. If your stomach feels
          sensitive, increase fiber gradually and take smaller bites, chewing
          thoroughly.
        </p>
        <p>
          Carbohydrates and fats are still important; the right amount depends
          on your plan and activity. Choose slow‑digesting carbs (beans,
          berries, lentils, limited whole grains if included) and pair them with
          protein. Use healthy fats—olive oil, avocado, nuts—in modest portions
          to help with flavor and fullness without overshooting calories.
        </p>
        <p>
          Eating slowly is a powerful strategy on GLP‑1s. Build meals with a
          simple template (lean protein + non‑starchy vegetables + optional
          healthy fat), put your fork down between bites, and pause at
          comfortable fullness. Many people feel best with three structured
          meals and minimal grazing.
        </p>
        <p>
          Finally, keep hydration and minerals in mind. Sip water throughout the
          day and consider an electrolyte supplement if you notice
          lightheadedness or cramping—especially in hot weather or after
          exercise. If nausea or reflux shows up, smaller meals, ginger tea, and
          mindful pacing can help. Work with your coach to personalize portions
          as your appetite changes over time.
        </p>
        <h2>Sources</h2>
        <ul>
          <li>
            <a
              href="https://diabetesjournals.org/care/issue"
              target="_blank"
              rel="noreferrer"
            >
              American Diabetes Association — Standards of Care in Diabetes
            </a>
          </li>
          <li>
            <a
              href="https://www.fda.gov/drugs"
              target="_blank"
              rel="noreferrer"
            >
              U.S. FDA — Drug Safety and Information (GLP‑1 class)
            </a>
          </li>
        </ul>
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
