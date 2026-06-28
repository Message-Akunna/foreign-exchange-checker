import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window === "undefined") return;

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Conversion link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link");
      });
  };

  return (
    <Button
      size="sm"
      type="button"
      onClick={handleShare}
      className={className}
      variant="outline-primary"
    >
      <Share2 className="size-3.5" />
      Share
    </Button>
  );
}
