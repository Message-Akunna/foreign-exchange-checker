import * as React from "react";
import { ShareIcon, CopyIcon, CheckIcon } from "@animateicons/react/lucide";
import { CopyButton } from "@/components/custom/copy-button";

interface CopyLinkButtonProps {
  className?: string;
}

export function CopyLinkButton({ className }: CopyLinkButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setValue(window.location.href);
    }
  }, []);

  return (
    <CopyButton
      size="sm"
      value={value}
      className={className}
      variant="outline-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      successMessage="Conversion link copied to clipboard!"
      icon={
        isHovered ? (
          <CopyIcon className="size-3.5" />
        ) : (
          <ShareIcon className="size-3.5" />
        )
      }
      copiedIcon={<CheckIcon className="size-3.5" />}
    />
  );
}
