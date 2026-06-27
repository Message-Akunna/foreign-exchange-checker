import * as React from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

// Glob all SVG flag assets eagerly as raw strings
const flagSvgs = import.meta.glob<string>("../../assets/flags/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

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

// Global static cache to prevent running expensive DOMPurify.sanitize on every single render of 165+ options
const sanitizedCache: Record<string, string> = {};

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

  const path = `../../assets/flags/${countryCode}.svg`;
  const rawSvg = flagSvgs[path] || "";

  const [isMounted, setIsMounted] = React.useState(!ssr);

  React.useEffect(() => {
    if (ssr) {
      setIsMounted(true);
    }
  }, [ssr]);

  // Add layout classes and force aspect ratio crop so the flag fills the size-5 container perfectly
  const svgWithStyles = React.useMemo(() => {
    if (!rawSvg) return "";
    return rawSvg
      .replace(/<svg([\s>])/i, '<svg class="w-full h-full block" preserveAspectRatio="xMidYMid slice"$1')
      .replace(/width="[^"]*"/g, "")
      .replace(/height="[^"]*"/g, "");
  }, [rawSvg]);

  // Safe SSR DOMPurify execution
  const cleanSvg = React.useMemo(() => {
    if (!svgWithStyles) return "";
    if (!isMounted || typeof window === "undefined") {
      return svgWithStyles;
    }
    const cacheKey = `${currencyCode}-${svgWithStyles.length}`;
    if (sanitizedCache[cacheKey]) {
      return sanitizedCache[cacheKey];
    }
    const sanitized = DOMPurify.sanitize(svgWithStyles, { USE_PROFILES: { svg: true } });
    sanitizedCache[cacheKey] = sanitized;
    return sanitized;
  }, [svgWithStyles, isMounted, currencyCode]);

  if (!rawSvg) return null;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center size-5 rounded-full overflow-hidden bg-muted shrink-0 select-none border border-border/30 flag-image-container",
        className
      )}
      dangerouslySetInnerHTML={{ __html: cleanSvg }}
      {...props}
    />
  );
});
