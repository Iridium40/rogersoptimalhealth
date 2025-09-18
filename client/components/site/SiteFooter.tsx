import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Link to="/" aria-label="Rogers Optimal Health home">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2Fef0136ecdde74b46be05d2666c884154?format=webp&width=800"
                alt="Rogers Optimal Health logo"
                className="h-16 w-auto md:h-20"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mt-2 max-w-xs">
              Personalized health coaching for sustainable, healthy living.
            </p>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              This site does not provide medical advice. Consult your physician
              before beginning any program.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-2">
            <Link to="/my-story" className="hover:text-foreground">
              My Story
            </Link>
            <Link to="/why-coaching" className="hover:text-foreground">
              Client Support
            </Link>
            <Link to="/recipes" className="hover:text-foreground">
              Lean & Green Recipe Ideas
            </Link>
            <Link to="/book-assessment" className="hover:text-foreground">
              Book Assessment
            </Link>
            <a
              href={
                import.meta.env.VITE_OPTAVIA_COACH_URL ||
                "https://www.optavia.com/us/en/coach//leneerogers"
              }
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Start Your Journey
            </a>
            <a
              href="https://www.optavia.com/us/en/coach//leneerogers"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              OPTAVIA Coach Profile
            </a>
            <a
              href="https://www.facebook.com/leneebiglane.rogers"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a
              href="https://www.instagram.com/leneerogers/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </nav>
          <div className="md:text-right">
            <div className="font-medium text-foreground">Ready to begin?</div>
            <a
              href={
                import.meta.env.VITE_OPTAVIA_COACH_URL ||
                "https://www.optavia.com/us/en/coach//leneerogers"
              }
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Start Your Journey
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t pt-6 md:flex-row">
          <div className="text-center md:text-left">
            <p>
              © {new Date().getFullYear()} Rogers Optimal Health. All rights
              reserved.
            </p>
            <p className="mt-1 text-xs">
              This website is independently operated by Lenee Rogers and is not affiliated with, endorsed by, or operated by OPTAVIA LLC.
            </p>
          </div>
          <p>Built with love for healthy habits.</p>
        </div>
      </div>
    </footer>
  );
}
