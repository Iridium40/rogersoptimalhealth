import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Share2, QrCode, Facebook, Instagram, Copy, Check } from "lucide-react";

type ShareButtonProps = {
  url?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  size?: "sm" | "lg" | "default" | "icon";
};

export default function ShareButton({
  url,
  title = typeof document !== "undefined" ? document.title : "Share",
  description = "",
  buttonLabel = "Share",
  size = "sm",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeError, setQrCodeError] = useState(false);

  const currentUrl = useMemo(() => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "/";
  }, [url]);

  const pageTitle = title;
  const pageDescription = description || title;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`,
  } as const;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = (platform: keyof typeof shareUrls | "copy") => {
    if (platform === "copy") return copyToClipboard();
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=520");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size={size}>
          <Share2 className="mr-2 h-4 w-4" /> {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold">{pageTitle}</h4>
            <p className="text-sm text-muted-foreground">
              Help others discover this page
            </p>
          </div>

          <Separator />

          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span className="text-sm font-medium">QR Code</span>
            </div>
            <div className="flex justify-center">
              {!qrCodeError ? (
                <div className="rounded-lg border bg-white p-2">
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code for ${pageTitle}`}
                    className="h-32 w-32"
                    onError={() => setQrCodeError(true)}
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <QrCode className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                      QR Code unavailable
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Scan to visit on mobile
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h5 className="text-sm font-medium">Share on social media</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleShare("instagram")}
              >
                <Instagram className="mr-2 h-4 w-4 text-pink-500" /> Instagram
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h5 className="text-sm font-medium">Copy link</h5>
            <div className="flex space-x-2">
              <div className="flex-1 truncate rounded bg-muted p-2 text-xs font-mono">
                {new URL(currentUrl, "http://x").host || currentUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
                className={copied ? "text-green-600" : ""}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <Badge variant="secondary" className="text-xs">
                Link copied to clipboard!
              </Badge>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
