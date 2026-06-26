import type * as React from "react";
import { cn } from "@/lib/utils";

import usdFlag from "@/assets/images/flags/us.webp";
import eurFlag from "@/assets/images/flags/eu.webp";
import gbpFlag from "@/assets/images/flags/gb.webp";
import jpyFlag from "@/assets/images/flags/jp.webp";
import chfFlag from "@/assets/images/flags/ch.webp";
import audFlag from "@/assets/images/flags/au.webp";
import cadFlag from "@/assets/images/flags/ca.webp";
import inFlag from "@/assets/images/flags/in.webp";
import cnFlag from "@/assets/images/flags/cn.webp";
import bdFlag from "@/assets/images/flags/bd.webp";
import nzFlag from "@/assets/images/flags/nz.webp";
import trFlag from "@/assets/images/flags/tr.webp";

const FLAG_MAP: Record<string, string> = {
  USD: usdFlag,
  EUR: eurFlag,
  GBP: gbpFlag,
  JPY: jpyFlag,
  CHF: chfFlag,
  AUD: audFlag,
  CAD: cadFlag,
  INR: inFlag,
  CNY: cnFlag,
  BDT: bdFlag,
  NZD: nzFlag,
  TRY: trFlag,
};

interface FlagImageProps extends React.ComponentProps<"img"> {
  code: string;
  className?: string;
}

export function FlagImage({ code, className, ...props }: FlagImageProps) {
  const src = FLAG_MAP[code.toUpperCase()];
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
