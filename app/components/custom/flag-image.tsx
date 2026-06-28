import * as React from "react";
import { cn } from "@/lib/utils";
import { VALID_FLAGS } from "./flag-list";

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  CHF: "ch",
  AUD: "au",
  CAD: "ca",
  INR: "in",
  CNY: "cn",
  NZD: "nz",
  TRY: "tr",
  BGN: "bg",
  BRL: "br",
  CZK: "cz",
  DKK: "dk",
  HKD: "hk",
  HUF: "hu",
  IDR: "id",
  ILS: "il",
  ISK: "is",
  KRW: "kr",
  MXN: "mx",
  MYR: "my",
  NOK: "no",
  PHP: "ph",
  PLN: "pl",
  RON: "ro",
  SEK: "se",
  SGD: "sg",
  THB: "th",
  ZAR: "za",
};

interface FlagImageProps extends React.ComponentProps<"span"> {
  code: string;
  className?: string;
  ssr?: boolean;
}

export const FlagImage = React.memo(function FlagImage({
  code,
  className,
  ssr = true,
  ...props
}: FlagImageProps) {
  const currencyCode = code.toUpperCase();
  const countryCode =
    CURRENCY_TO_COUNTRY[currencyCode] || currencyCode.slice(0, 2).toLowerCase();

  // Keep parity with original behavior: if flag asset does not exist, return null
  if (!VALID_FLAGS.has(countryCode)) {
    return null;
  }

  const src = `/assets/images/flags/${countryCode}.webp`;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center size-5 rounded-full overflow-hidden bg-muted shrink-0 select-none border border-border/30 flag-image-container",
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={`${currencyCode} flag`}
        className="h-5 w-auto object-cover"
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
});
