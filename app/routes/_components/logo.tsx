import { useTheme } from "@/providers/theme-provider";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme !== "system" || !mounted) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, mounted]);

  const getLogoSrc = () => {
    if (!mounted) {
      return "/logo-dark.png";
    }
    if (theme === "dark") return "/logo-light.png";
    if (theme === "light") return "/logo-dark.png";
    if (theme === "system") {
      return systemDark ? "/logo-light.png" : "/logo-dark.png";
    }
    return "/logo-light.png";
  };

  return (
    <img
      src={getLogoSrc()}
      alt="FX Checker Logo"
      width={139}
      height={26}
      className={className}
    />
  );
}
