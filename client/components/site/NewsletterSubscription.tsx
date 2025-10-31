import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewsletterSubscriptionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

// Declare Turnstile types
declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function NewsletterSubscription({
  title = "Join the Rogers Optimal Health Community",
  description = "Get weekly health tips, Lean & Green recipes, and exclusive content delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = "",
  variant = "default",
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

  // Load Turnstile script
  useEffect(() => {
    if (!turnstileSiteKey) {
      console.warn("Turnstile site key not configured");
      return;
    }

    // Check if script is already loaded
    if (document.querySelector('script[src*="turnstile"]')) {
      // Script already loaded, just render widget if ref is ready
      const renderWidget = () => {
        if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            'error-callback': () => {
              setTurnstileToken(null);
            },
            'expired-callback': () => {
              setTurnstileToken(null);
            },
          });
        }
      };

      // Try to render immediately, or wait a bit for DOM
      if (window.turnstile && turnstileRef.current) {
        renderWidget();
      } else {
        const timer = setTimeout(renderWidget, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const renderWidget = () => {
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
          },
        });
      }
    };

    script.onload = () => {
      // Wait a bit for ref to be ready
      setTimeout(renderWidget, 100);
    };

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.warn("Error removing Turnstile widget:", e);
        }
      }
      // Only remove script if we added it (check if it's our script)
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript && existingScript === script) {
        document.body.removeChild(script);
      }
    };
  }, [turnstileSiteKey]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Check for Turnstile token if site key is configured
    if (turnstileSiteKey && !turnstileToken) {
      toast({
        title: "Verification Required",
        description: "Please complete the verification to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Making newsletter subscription request...");
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(),
          token: turnstileToken 
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Always get the response text first to avoid parsing issues
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        console.error("HTTP error response:", responseText);
        throw new Error(`Server error (${response.status}): Please try again later`);
      }

      // Try to parse as JSON, but handle failures gracefully
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.log("Response was not valid JSON:", responseText);
        throw new Error("Server response error - please try again");
      }

      // Check if we got a valid success response
      if (data && typeof data === 'object' && data.success === true) {
        setIsSubscribed(true);
        setEmail("");
        setTurnstileToken(null);
        // Reset Turnstile widget if it exists
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for joining the Rogers Optimal Health community. Check your email for a welcome message.",
        });
      } else {
        const errorMessage = data?.error || data?.message || "Subscription failed";
        console.error("Subscription failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Welcome to Rogers Optimal Health!</h3>
          <p className="text-muted-foreground">
            You're now subscribed to our newsletter. Check your email for a welcome message.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          {turnstileSiteKey && (
            <div ref={turnstileRef} className="flex justify-center"></div>
          )}
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? "..." : buttonText}
          </Button>
        </form>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          {turnstileSiteKey && (
            <div ref={turnstileRef} className="flex justify-center"></div>
          )}
          <Button type="submit" disabled={isLoading} className="sm:w-auto">
            {isLoading ? "Subscribing..." : buttonText}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          {turnstileSiteKey && (
            <div ref={turnstileRef} className="flex justify-center"></div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Subscribing..." : buttonText}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
