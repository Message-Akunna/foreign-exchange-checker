import type * as React from "react";
import { cn } from "@/lib/utils";

// Glob all SVG flag assets eagerly using relative path
const flagSvgs = import.meta.glob<{ default: string }>(
  "../../assets/flags/*.svg",
  { eager: true }
);

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

interface FlagImageProps extends React.ComponentProps<"img"> {
  code: string;
  className?: string;
}

export function FlagImage({ code, className, ...props }: FlagImageProps) {
  const currencyCode = code.toUpperCase();
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode] || currencyCode.slice(0, 2).toLowerCase();
  
  const path = `../../assets/flags/${countryCode}.svg`;
  const src = flagSvgs[path]?.default;
  
  if (!src) return null;

  return (
    <span
      className={cn(
        "flex items-center justify-center size-5 rounded-full overflow-hidden bg-muted shrink-0 select-none border border-border/30",
        className
      )}
    >
      <img
        src={src}
        alt={`${code} flag`}
        className="w-full h-full object-cover"
        {...props}
      />
    </span>
  );
}

