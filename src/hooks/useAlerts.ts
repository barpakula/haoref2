import { useState, useEffect, useCallback, useRef } from "react";
import {
  OrefAlert,
  MissileOrigin,
  TrackerState,
  EventPhase,
  IRAN_EARLY_WARNING_CATS,
} from "@/lib/types";
import {
  MOCK_IRAN_EARLY_WARNING,
  MOCK_IRAN_MISSILES,
  MOCK_LEBANON_MISSILES,
  getRandomLauncher,
} from "@/lib/mock-data";

const IRAN_ETA_SECONDS = 7 * 60;
const POLL_INTERVAL = 2000;
const EVENT_ENDED_TITLE = "האירוע הסתיים";

const INITIAL_STATE: TrackerState = {
  phase: "idle",
  origin: null,
  alerts: [],
  earlyWarningTime: null,
  currentStep: 0,
  etaSeconds: null,
  affectedCities: [],
  missileWaves: 0,
};

function isIranEarlyWarning(alert: OrefAlert): boolean {
  if (alert.title === EVENT_ENDED_TITLE) return false;
  return IRAN_EARLY_WARNING_CATS.includes(alert.cat);
}

function isEventEnded(alert: OrefAlert): boolean {
  return alert.title === EVENT_ENDED_TITLE;
}

function isMissileAlert(alert: OrefAlert): boolean {
  return alert.cat === "1";
}

function stepFromPhase(
  phase: EventPhase,
  earlyWarningTime: number | null
): number {
  switch (phase) {
    case "idle":
      return 0;
    case "earlyWarning": {
      // Steps 2-4 during early warning; step 5 ONLY on actual missile alert
      if (!earlyWarningTime) return 2;
      const elapsed = (Date.now() - earlyWarningTime) / 1000;
      if (elapsed < 120) return 2;  // launcher deployed
      if (elapsed < 270) return 3;  // ammo loaded
      return 4;                     // countdown — caps here until real alert
    }
    case "missiles":
      return 5; // actual alarm / missile on the way
    case "ended":
      return 0;
  }
}

// Merge new cities into existing set, return new array
function mergeCities(existing: string[], incoming: string[]): string[] {
  const set = new Set(existing);
  for (const city of incoming) {
    if (city) set.add(city);
  }
  return Array.from(set);
}

export function useAlerts(demoMode: boolean) {
  const [state, setState] = useState<TrackerState>(INITIAL_STATE);
  const [launcher, setLauncher] = useState(getRandomLauncher());
  const [alertHistory, setAlertHistory] = useState<OrefAlert[]>([]);
  const earlyWarningRef = useRef<number | null>(null);
  const lastAlertIdRef = useRef<string | null>(null);

  const processAlert = useCallback((alert: OrefAlert) => {
    // Dedup: skip if same alert ID
    if (alert.id === lastAlertIdRef.current) return;
    lastAlertIdRef.current = alert.id;

    // Add to history
    setAlertHistory((prev) => [alert, ...prev].slice(0, 100));

    // STATE MACHINE TRANSITIONS
    setState((prev) => {
      const newAlerts = [alert, ...prev.alerts].slice(0, 30);

      // EVENT ENDED → reset to ended phase
      if (isEventEnded(alert)) {
        earlyWarningRef.current = null;
        return {
          ...INITIAL_STATE,
          phase: "ended",
          alerts: newAlerts,
          affectedCities: prev.affectedCities, // keep cities for display
        };
      }

      // IRAN EARLY WARNING → transition to earlyWarning phase
      if (isIranEarlyWarning(alert)) {
        if (!earlyWarningRef.current) {
          earlyWarningRef.current = Date.now();
          setLauncher(getRandomLauncher());
        }
        const cities = mergeCities(prev.affectedCities, alert.data);
        return {
          phase: "earlyWarning",
          origin: "iran" as MissileOrigin,
          alerts: newAlerts,
          earlyWarningTime: earlyWarningRef.current,
          currentStep: stepFromPhase("earlyWarning", earlyWarningRef.current),
          etaSeconds: IRAN_ETA_SECONDS,
          affectedCities: cities,
          missileWaves: prev.missileWaves,
        };
      }

      // MISSILE ALERT → transition to missiles phase
      if (isMissileAlert(alert)) {
        const hadEarlyWarning = earlyWarningRef.current !== null;
        const origin: MissileOrigin = hadEarlyWarning ? "iran" : "lebanon";
        const cities = mergeCities(prev.affectedCities, alert.data);
        const waves = prev.missileWaves + 1;

        if (origin === "lebanon" && !earlyWarningRef.current) {
          setLauncher(getRandomLauncher());
        }

        let etaSeconds: number | null = null;
        if (origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }

        return {
          phase: "missiles",
          origin,
          alerts: newAlerts,
          earlyWarningTime: earlyWarningRef.current,
          currentStep: 5,
          etaSeconds,
          affectedCities: cities,
          missileWaves: waves,
        };
      }

      // Unknown alert type — just add to alerts, don't change phase
      return { ...prev, alerts: newAlerts };
    });
  }, []);

  // Poll real API
  useEffect(() => {
    if (demoMode) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/alerts");
        const text = await res.text();
        const cleaned = text.replace(/^\uFEFF/, "").trim();
        if (cleaned) {
          const data = JSON.parse(cleaned);
          if (data && data.id) {
            processAlert(data);
          }
        }
      } catch {
        // Silently fail
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [demoMode, processAlert]);

  // Tick every second: update step + ETA countdown during active phases
  useEffect(() => {
    if (state.phase !== "earlyWarning" && state.phase !== "missiles") return;

    const interval = setInterval(() => {
      setState((s) => {
        const step = stepFromPhase(s.phase, earlyWarningRef.current);
        let etaSeconds = s.etaSeconds;
        if (s.origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }
        return { ...s, currentStep: step, etaSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase]);

  const clearAlerts = useCallback(() => {
    setState(INITIAL_STATE);
    earlyWarningRef.current = null;
    lastAlertIdRef.current = null;
  }, []);

  const triggerDemo = useCallback(
    (scenario: "iran" | "lebanon") => {
      setState(INITIAL_STATE);
      earlyWarningRef.current = null;
      lastAlertIdRef.current = null;
      setLauncher(getRandomLauncher());
      if (scenario === "iran") {
        processAlert(MOCK_IRAN_EARLY_WARNING);
        setTimeout(() => processAlert(MOCK_IRAN_MISSILES), 30000);
      } else {
        processAlert(MOCK_LEBANON_MISSILES);
      }
    },
    [processAlert]
  );

  return { state, launcher, alertHistory, clearAlerts, triggerDemo };
}
