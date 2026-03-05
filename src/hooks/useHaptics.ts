import { useWebHaptics } from "web-haptics/react";

export function useHaptics() {
  const { trigger } = useWebHaptics();

  return {
    tap: () => trigger("nudge"),
    success: () => trigger("success"),
    error: () => trigger("error"),
    alert: () => trigger("buzz"),
    heavy: () => trigger([{ duration: 100, intensity: 1 }, { delay: 60, duration: 80, intensity: 0.6 }]),
  };
}
