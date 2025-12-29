import Disclaimer from "@/components/site/Disclaimer";
import InstagramEmbed from "@/components/site/InstagramEmbed";
import SEO from "@/components/site/SEO";

export default function MyStory() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO
        title="My Story | Rogers Optimal Health"
        description="My journey and coaching philosophy: a holistic, personalized approach empowering sustainable health and well‑being."
        image="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F67f507b077de46a0bb2324ea8656430b?format=webp&width=1200"
      />
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        My Story
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        My journey as a Certified Health & Wellness Coach
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="prose prose-slate max-w-none leading-relaxed space-y-6 prose-p:mt-0 prose-h2:mt-0 prose-h2:font-bold">
          <h2>Passionate Health Advocate</h2>
          <p>
            I am a passionate and dedicated certified health and
            wellness coach with a wealth of experience in empowering individuals
            to make positive changes in their lives. With a deep understanding
            of nutrition, fitness, and lifestyle habits, I am skilled at
            helping people develop and implement sustainable changes that lead
            to improved overall well‑being.
          </p>

          <h2>Holistic Health Believer</h2>
          <p>
            As a firm believer in the power of holistic health, I am
            committed to guiding my clients toward optimal physical and mental
            wellness. With my extensive knowledge and expertise, I have
            successfully supported numerous individuals in achieving their
            health goals, transforming their lives for the better.
          </p>

          <h2>Personalized Approach</h2>
          <p>
            My approach to coaching is rooted in empathy, understanding,
            and personalized attention. I recognize that each person's
            journey is unique and requires tailored strategies. By listening
            attentively and understanding my clients' needs and aspirations,
            I develop effective action plans that are realistic and
            achievable.
          </p>

          <h2>Optavia Expertise</h2>
          <p>
            One of the key resources I utilize in my coaching practice is
            Optavia. This is a clinically proven plan with scientifically
            developed products called fuelings. By leveraging Optavia's proven
            strategies and tools, I ensure that my clients have access to
            effective resources to support their transformational journey.
          </p>

          <h2>Coaching Philosophy</h2>
          <p>
            My coaching style combines compassion, accountability, and
            motivation. I create a safe and nurturing environment where
            individuals can explore challenges, overcome obstacles, and
            celebrate their successes. Through ongoing guidance, encouragement,
            and practical advice, I empower clients to adopt healthier
            habits, make informed choices, and sustain positive change in the
            long term.
          </p>
          <p>
            With me as your guide, you can expect a transformative experience
            that goes beyond achieving weight loss or fitness goals. My
            holistic approach fosters balance, self‑acceptance, and personal
            growth—enhancing physical health as well as mental and emotional
            resilience for a more fulfilling, vibrant life.
          </p>

          <div className="mt-6">
            <a
              href={
                import.meta.env.VITE_OPTAVIA_COACH_URL ||
                "https://www.optavia.com/us/en/coach//leneerogers"
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-white shadow hover:opacity-95"
            >
              Start Your Journey with Lenee
            </a>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/o/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2Faa7f706254ab4479b4afbc85668b04ca?alt=media&token=dd02c058-0ce0-40d3-af36-c74e26b28c99&apiKey=a42b6f9ec53e4654a92af75aad56d14f"
          alt="Lenee Rogers"
          className="h-auto w-full lg:w-1/2 mx-auto rounded-xl object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      <Disclaimer className="mt-10" />
    </div>
  );
}
