import { useState, useEffect, useCallback, useRef } from "react";
import { OrefAlert, MissileOrigin, TrackerState, IRAN_EARLY_WARNING_CATS } from "@/lib/types";
import {
  MOCK_IRAN_EARLY_WARNING,
  MOCK_IRAN_MISSILES,
  MOCK_LEBANON_MISSILES,
  getRandomLauncher,
} from "@/lib/mock-data";

const IRAN_ETA_SECONDS = 7 * 60;
const POLL_INTERVAL = 2000;
const EVENT_ENDED_TITLE = "האירוע הסתיים";

function isIranEarlyWarning(alert: OrefAlert): boolean {
  // Cat 10 is used for BOTH early warning AND "event ended"
  // Distinguish by title: "האירוע הסתיים" = all-clear, anything else = early warning
  if (alert.title === EVENT_ENDED_TITLE) return false;
  return IRAN_EARLY_WARNING_CATS.includes(alert.cat);
}

function isEventEnded(alert: OrefAlert): boolean {
  return alert.title === EVENT_ENDED_TITLE;
}

function inferOrigin(
  alert: OrefAlert,
  hadEarlyWarning: boolean
): MissileOrigin {
  if (isEventEnded(alert)) return null;
  if (isIranEarlyWarning(alert)) return "iran";
  if (alert.cat === "1" && hadEarlyWarning) return "iran";
  if (alert.cat === "1") return "lebanon";
  return null;
}

function getStepForState(
  origin: MissileOrigin,
  earlyWarningTime: number | null,
  hasMissileAlert: boolean
): number {
  if (!origin) return 0;
  if (origin === "iran") {
    if (!earlyWarningTime) return 1;
    const elapsed = (Date.now() - earlyWarningTime) / 1000;
    if (elapsed < 60) return 2;
    if (elapsed < 180) return 3;
    if (elapsed < 300) return 4;
    return 5;
  }
  return hasMissileAlert ? 5 : 0;
}

export function useAlerts(demoMode: boolean) {
  const [state, setState] = useState<TrackerState>({
    isActive: false,
    origin: null,
    alerts: [],
    earlyWarningTime: null,
    currentStep: 0,
    etaSeconds: null,
    affectedCities: [],
  });
  const [launcher, setLauncher] = useState(getRandomLauncher());
  const [alertHistory, setAlertHistory] = useState<OrefAlert[]>([]);
  const earlyWarningRef = useRef<number | null>(null);
  const lastAlertIdRef = useRef<string | null>(null);

  const processAlert = useCallback((alert: OrefAlert) => {
    // Skip if we've already seen this exact alert
    if (alert.id === lastAlertIdRef.current) return;
    lastAlertIdRef.current = alert.id;

    // Add to local history
    setAlertHistory((prev) => [alert, ...prev].slice(0, 100));

    // "האירוע הסתיים" = all-clear, end the active alert
    if (isEventEnded(alert)) {
      setState((s) => ({
        ...s,
        isActive: false,
        currentStep: 0,
        alerts: [alert, ...s.alerts],
      }));
      earlyWarningRef.current = null;
      return;
    }

    const hadEarlyWarning = earlyWarningRef.current !== null;
    const origin = inferOrigin(alert, hadEarlyWarning);

    if (isIranEarlyWarning(alert) && !earlyWarningRef.current) {
      earlyWarningRef.current = Date.now();
      setLauncher(getRandomLauncher());
    }

    if (origin) {
      const hasMissileAlert = alert.cat === "1";
      const step = getStepForState(
        origin,
        earlyWarningRef.current,
        hasMissileAlert
      );

      let etaSeconds: number | null = null;
      if (origin === "iran" && earlyWarningRef.current) {
        const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
        etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
      }

      setState((s) => ({
        isActive: true,
        origin,
        alerts: [alert, ...s.alerts.filter((a) => a.id !== alert.id)].slice(0, 20),
        earlyWarningTime: earlyWarningRef.current,
        currentStep: step,
        etaSeconds,
        affectedCities: alert.data.filter(Boolean),
      }));
    }
  }, []);

  // Poll real API
  useEffect(() => {
    if (demoMode) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/alerts");
        const text = await res.text();
        // The API returns a BOM + JSON object (not array) when active, empty string when inactive
        const cleaned = text.replace(/^\uFEFF/, "").trim();
        if (cleaned) {
          const data = JSON.parse(cleaned);
          if (data && data.id) {
            processAlert(data);
          }
        }
      } catch {
        // Silently fail on poll errors
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [demoMode, processAlert]);

  // Update step and ETA every second during active alert
  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      setState((s) => {
        const step = getStepForState(
          s.origin,
          earlyWarningRef.current,
          s.alerts.some((a) => a.cat === "1")
        );
        let etaSeconds = s.etaSeconds;
        if (s.origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }
        return { ...s, currentStep: step, etaSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive]);

  const clearAlerts = useCallback(() => {
    setState({
      isActive: false,
      origin: null,
      alerts: [],
      earlyWarningTime: null,
      currentStep: 0,
      etaSeconds: null,
      affectedCities: [],
    });
    earlyWarningRef.current = null;
    lastAlertIdRef.current = null;
  }, []);

  const triggerDemo = useCallback(
    (scenario: "iran" | "lebanon") => {
      earlyWarningRef.current = null;
      lastAlertIdRef.current = null;
      setLauncher(getRandomLauncher());
      if (scenario === "iran") {
        processAlert(MOCK_IRAN_EARLY_WARNING);
        setTimeout(() => processAlert(MOCK_IRAN_MISSILES), 8000);
      } else {
        processAlert(MOCK_LEBANON_MISSILES);
      }
    },
    [processAlert]
  );

  return { state, launcher, alertHistory, clearAlerts, triggerDemo };
}
