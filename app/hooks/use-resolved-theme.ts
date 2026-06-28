import { useEffect, useState } from "react";

export type ResolvedTheme = "light" | "dark";

export function getDocumentTheme(): ResolvedTheme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolves the active theme by watching the document root class list
 * (set by the ThemeProvider) and falling back to the OS preference.
 */
export function useResolvedTheme(): ResolvedTheme {
  const [theme, setTheme] = useState<ResolvedTheme>(
    () => getDocumentTheme() ?? getSystemTheme()
  );

  useEffect(() => {
    // Watch for ThemeProvider toggling .dark / .light on <html>
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) setTheme(docTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also watch OS preference for when no explicit class is set
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mq.addEventListener("change", handleSystemChange);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return theme;
}
