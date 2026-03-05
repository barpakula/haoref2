import { useState, useEffect, useCallback, useRef } from "react";
import { OrefAlert, MissileOrigin, TrackerState } from "@/lib/types";
import {
  MOCK_IRAN_EARLY_WARNING,
  MOCK_IRAN_MISSILES,
  MOCK_LEBANON_MISSILES,
  getRandomLauncher,
} from "@/lib/mock-data";

const IRAN_ETA_SECONDS = 7 * 60;
const POLL_INTERVAL = 2000;

function inferOrigin(
  alert: OrefAlert,
  hadEarlyWarning: boolean
): MissileOrigin {
  if (alert.cat === "14") return "iran";
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
  const earlyWarningRef = useRef<number | null>(null);

  const processAlerts = useCallback((alerts: OrefAlert[]) => {
    if (!alerts || alerts.length === 0) return;

    const hadEarlyWarning = earlyWarningRef.current !== null;

    for (const alert of alerts) {
      const origin = inferOrigin(alert, hadEarlyWarning);

      if (alert.cat === "14" && !earlyWarningRef.current) {
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
        const cities = alerts.flatMap((a) => a.data).filter(Boolean);

        let etaSeconds: number | null = null;
        if (origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }

        setState({
          isActive: true,
          origin,
          alerts,
          earlyWarningTime: earlyWarningRef.current,
          currentStep: step,
          etaSeconds,
          affectedCities: cities,
        });
        return;
      }
    }
  }, []);

  // Poll real API
  useEffect(() => {
    if (demoMode) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/alerts");
        const text = await res.text();
        if (text && text.trim()) {
          const data = JSON.parse(text);
          const alerts = Array.isArray(data) ? data : data ? [data] : [];
          processAlerts(alerts);
        } else {
          if (state.isActive) {
            setState((s) => ({ ...s, isActive: false, currentStep: 0 }));
            earlyWarningRef.current = null;
          }
        }
      } catch {
        // Silently fail on poll errors
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [demoMode, processAlerts, state.isActive]);

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
  }, []);

  const triggerDemo = useCallback(
    (scenario: "iran" | "lebanon") => {
      earlyWarningRef.current = null;
      setLauncher(getRandomLauncher());
      if (scenario === "iran") {
        processAlerts([MOCK_IRAN_EARLY_WARNING]);
        setTimeout(() => processAlerts([MOCK_IRAN_MISSILES]), 8000);
      } else {
        processAlerts([MOCK_LEBANON_MISSILES]);
      }
    },
    [processAlerts]
  );

  return { state, launcher, clearAlerts, triggerDemo };
}
