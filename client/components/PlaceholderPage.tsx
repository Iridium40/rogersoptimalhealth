import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/book-assessment">Book Your Free Health Assessment</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/success-stories">Read Success Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
