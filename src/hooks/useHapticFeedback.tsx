import { useCallback } from "react";

type HapticStyle = "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error";

export function useHapticFeedback() {
  const vibrate = useCallback((style: HapticStyle = "light") => {
    // Check if vibration API is supported
    if (!("vibrate" in navigator)) return;
    
    // Define vibration patterns for different styles
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      selection: 5,
      success: [10, 50, 10],
      warning: [20, 30, 20],
      error: [30, 50, 30, 50, 30],
    };
    
    try {
      navigator.vibrate(patterns[style]);
    } catch {
      // Silently fail if vibration is not available
    }
  }, []);

  const selectionChanged = useCallback(() => vibrate("selection"), [vibrate]);
  const impactLight = useCallback(() => vibrate("light"), [vibrate]);
  const impactMedium = useCallback(() => vibrate("medium"), [vibrate]);
  const impactHeavy = useCallback(() => vibrate("heavy"), [vibrate]);
  const notificationSuccess = useCallback(() => vibrate("success"), [vibrate]);
  const notificationWarning = useCallback(() => vibrate("warning"), [vibrate]);
  const notificationError = useCallback(() => vibrate("error"), [vibrate]);

  return {
    vibrate,
    selectionChanged,
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationWarning,
    notificationError,
  };
}
