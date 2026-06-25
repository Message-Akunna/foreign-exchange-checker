// auth/hooks/use-idle-logout.ts
import { useEffect } from "react";

export const useIdleLogout = (
  enabled: boolean,
  timeoutMs: number,
  onIdle: () => void
) => {
  useEffect(() => {
    if (!enabled) return;

    let timer: number;

    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onIdle, timeoutMs);
    };

    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, reset);
    });

    reset();

    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, reset);
      });
    };
  }, [enabled, timeoutMs, onIdle]);
};
