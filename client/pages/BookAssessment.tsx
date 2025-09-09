import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/site/ShareButton";
import SEO from "@/components/site/SEO";
import type {
  HealthAssessmentRequest,
  HealthAssessmentResponse,
} from "@shared/api";

export default function BookAssessment() {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL as string | undefined;
  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const unlocked = result === "success";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const b = (name: string) =>
      fd.get(name) === "on" || fd.get(name) === "true";
    const n = (name: string) => {
      const val = fd.get(name)?.toString().trim();
      if (!val) return undefined;
      const num = Number(val);
      return Number.isFinite(num) ? num : undefined;
    };
    const s = (name: string) => fd.get(name)?.toString().trim() || undefined;

    const payload: HealthAssessmentRequest = {
      firstName: s("firstName") || "",
      lastName: s("lastName") || "",
      email: s("email") || "",
      phone: s("phone"),
      date: s("date") || today,
      dob: s("dob"),
      howHeard: s("howHeard"),
      goalsCurrentState: s("goalsCurrentState") || "",
      goalsWhy: s("goalsWhy"),
      pregnant: b("pregnant"),
      nursing: b("nursing"),
      babyAgeMonths: s("babyAgeMonths"),
      diabetesType1: b("diabetesType1"),
      diabetesType2: b("diabetesType2"),
      highBloodPressure: b("highBloodPressure"),
      highCholesterol: b("highCholesterol"),
      gout: b("gout"),
      ibs: b("ibs"),
      otherConditions: s("otherConditions"),
      onMedications: b("onMedications"),
      medications: s("medications"),
      sleepQuality: n("sleepQuality"),
      energyLevel: n("energyLevel"),
      mealsPerDay: n("mealsPerDay"),
      snacksPerDay: n("snacksPerDay"),
      waterIntakeOz: n("waterIntakeOz"),
      caffeinePerDay: n("caffeinePerDay"),
      alcoholPerWeek: n("alcoholPerWeek"),
      exerciseDaysPerWeek: n("exerciseDaysPerWeek"),
      exerciseTypes: s("exerciseTypes"),
      wakeTime: s("wakeTime"),
      bedTime: s("bedTime"),
      commitment: n("commitment"),
      additionalNotes: s("additionalNotes"),
    };

    setSubmitting(true);
    setResult(null);
    try {
      const resp = await fetch("/api/health-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = (await resp.json()) as HealthAssessmentResponse;
        if (data.ok) {
          setResult("success");
          e.currentTarget.reset();
          document
            .getElementById("schedule")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          setResult("error");
        }
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <SEO
        title="Book Your Free Health Assessment | Rogers Optimal Health"
        description="Complete a quick health assessment and, once submitted, schedule time with coach Lenee Rogers."
        image="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F67f507b077de46a0bb2324ea8656430b?format=webp&width=1200"
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,theme(colors.secondary/60),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Book Your Free Health Assessment
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                A 30-minute conversation to learn about your goals and share how
                the Optavia program and personalized coaching can help. No
                pressure—just helpful, practical guidance.
              </p>
              {!calendlyUrl && (
                <div className="mt-6 rounded-lg border bg-white p-4 text-sm text-amber-700">
                  Calendly is not configured yet. Add VITE_CALENDLY_URL to
                  enable inline booking. You can still contact via the form
                  below.
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#health-assessment">Fill Health Assessment</a>
                </Button>
                {calendlyUrl && unlocked && (
                  <Button asChild size="lg" variant="outline">
                    <a href="#schedule">Proceed to Calendar</a>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <div className="mb-4 flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2Fe07ddbca8c7e423c96390cdff4411bdd"
                  alt="Kayce Smith"
                  className="h-[300px] w-[300px] rounded-xl object-contain border bg-white p-1 shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {!calendlyUrl ? (
                <div
                  id="schedule"
                  className="w-full overflow-hidden rounded-xl border bg-card p-2 shadow-sm"
                >
                  <div className="p-6 text-sm text-muted-foreground">
                    Calendar will appear here once connected.
                  </div>
                </div>
              ) : !unlocked ? (
                <div className="flex justify-center">
                  <ShareButton
                    size="lg"
                    title="Book Your Free Health Assessment"
                    description="Complete this quick assessment and book time with Kayce."
                  />
                </div>
              ) : (
                <div
                  id="schedule"
                  className="w-full overflow-hidden rounded-xl border bg-card p-2 shadow-sm"
                >
                  <iframe
                    title="Book with Kayce — Calendly"
                    src={`${calendlyUrl}`}
                    className="h-[640px] w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="health-assessment" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Health Assessment
          </h2>
          <p className="mt-2 text-muted-foreground">
            Please complete the assessment below. Your responses will be emailed
            securely to Kayce for review before your call.
          </p>

          {result === "success" && (
            <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              Thanks! Your Health Assessment was submitted successfully.
            </div>
          )}
          {result === "error" && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
              Sorry, there was a problem sending your assessment. Please try
              again.
            </div>
          )}

          <form
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={onSubmit}
          >
            {/* Contact */}
            <label className="grid gap-1">
              <span className="text-sm font-medium">First Name</span>
              <input
                required
                name="firstName"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Last Name</span>
              <input
                required
                name="lastName"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                name="email"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Phone</span>
              <input
                name="phone"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Today's Date</span>
              <input
                type="date"
                name="date"
                defaultValue={today}
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Date of Birth</span>
              <input
                type="date"
                name="dob"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm font-medium">
                How did you hear about our program?
              </span>
              <input
                name="howHeard"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>

            {/* Goals */}
            <div className="md:col-span-2 mt-6 text-sm font-semibold text-foreground/80">
              GOALS
            </div>
            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm font-medium">
                Right now, where are you in your health? (weight, energy, sleep,
                self‑confidence…)
              </span>
              <textarea
                required
                name="goalsCurrentState"
                className="min-h-28 rounded-md border bg-white px-3 py-2 outline-none ring-primary focus:ring-2"
              />
            </label>
            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm font-medium">
                Why do you want to lose weight? What will be different in your
                life when you get to a healthy weight? What do your dream health
                goals look like?
              </span>
              <textarea
                name="goalsWhy"
                className="min-h-28 rounded-md border bg-white px-3 py-2 outline-none ring-primary focus:ring-2"
              />
            </label>

            {/* Medical */}
            <div className="md:col-span-2 mt-6 text-sm font-semibold text-foreground/80">
              MEDICAL
            </div>
            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="pregnant" /> Are you pregnant?
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="nursing" /> Are you nursing?
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  If yes, baby's age (months)
                </span>
                <input
                  name="babyAgeMonths"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="diabetesType1" /> Diabetes Type 1
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="diabetesType2" /> Diabetes Type 2
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="highBloodPressure" /> High Blood
                Pressure
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="highCholesterol" /> High
                Cholesterol
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="gout" /> Gout
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="ibs" /> IBS
              </label>
            </div>
            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm font-medium">Other conditions</span>
              <input
                name="otherConditions"
                className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
              />
            </label>
            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="onMedications" /> Are you currently
                taking any medications?
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  If yes, list them here
                </span>
                <input
                  name="medications"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
            </div>

            {/* Habits */}
            <div className="md:col-span-2 mt-6 text-sm font-semibold text-foreground/80">
              HABITS
            </div>
            <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Sleep quality (1–5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  name="sleepQuality"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Energy level (1–5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  name="energyLevel"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Meals per day</span>
                <input
                  type="number"
                  min={0}
                  max={15}
                  name="mealsPerDay"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Snacks per day</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  name="snacksPerDay"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Water intake (oz)</span>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  name="waterIntakeOz"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Caffeine (cups/day)</span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  name="caffeinePerDay"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">
                  Alcohol (drinks/week)
                </span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  name="alcoholPerWeek"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Exercise days/week</span>
                <input
                  type="number"
                  min={0}
                  max={14}
                  name="exerciseDaysPerWeek"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm font-medium">Exercise types</span>
                <input
                  name="exerciseTypes"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Wake time</span>
                <input
                  type="time"
                  name="wakeTime"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Bed time</span>
                <input
                  type="time"
                  name="bedTime"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Commitment (1–10)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  name="commitment"
                  className="h-11 rounded-md border bg-white px-3 outline-none ring-primary focus:ring-2"
                />
              </label>
            </div>

            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm font-medium">
                Anything else you'd like to share?
              </span>
              <textarea
                name="additionalNotes"
                className="min-h-28 rounded-md border bg-white px-3 py-2 outline-none ring-primary focus:ring-2"
              />
            </label>

            <div className="md:col-span-2 mt-2 flex flex-col items-start gap-2">
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Health Assessment"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Read our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
