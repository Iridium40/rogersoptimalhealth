import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Welcome! Check your email for a special welcome message.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <h3 className="mb-2 text-2xl font-bold tracking-tight">
          Join the Rogers Optimal Health Community
        </h3>
        
        <p className="mb-6 text-muted-foreground">
          Get weekly health tips, Lean & Green recipes, and exclusive content delivered to your inbox.
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                disabled={status === "loading"}
                className="shrink-0"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            
            {status === "error" && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{message}</span>
              </div>
            )}
          </form>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
