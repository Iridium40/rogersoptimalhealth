import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQs() {
  const faqs = [
    {
      q: "What results can I expect?",
      a: "Clients commonly see consistent weekly progress when following the plan and staying connected. We'll set a personalized pace that fits your life.",
    },
    {
      q: "Do I have to exercise?",
      a: "Movement is encouraged but not required to get started. We'll focus on simple habits first and layer activity as energy improves.",
    },
    {
      q: "Is the plan family‑friendly?",
      a: "Yes. Lean & Green meals work well for busy families with simple swaps and batch‑prep tips.",
    },
    {
      q: "How does coaching work?",
      a: "You'll get daily text support plus quick weekly check‑ins to remove roadblocks and celebrate wins.",
    },
    {
      q: "Is this sustainable long‑term?",
      a: "We transition you to a flexible maintenance plan with skills to protect your results for the long run.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        FAQs
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Answers to the most common questions about working together.
      </p>
      <div className="mt-8 rounded-2xl border bg-card p-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
