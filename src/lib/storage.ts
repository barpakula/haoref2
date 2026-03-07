import { TrackerState, OrefAlert } from "./types";

const STATE_KEY = "haoref-state";
const CITY_KEY = "haoref-user-city";
const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

interface PersistedData {
  state: TrackerState;
  alertHistory: OrefAlert[];
  launcher: string;
  timestamp: number;
}

export function saveState(
  state: TrackerState,
  alertHistory: OrefAlert[],
  launcher: string
): void {
  try {
    const data: PersistedData = { state, alertHistory, launcher, timestamp: Date.now() };
    localStorage.setItem(STATE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function loadState(): {
  state: TrackerState;
  alertHistory: OrefAlert[];
  launcher: string;
} | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const data: PersistedData = JSON.parse(raw);

    // If the persisted state is stale (event was active but it's been >15 min), reset phase
    if (
      data.state.phase !== "idle" &&
      data.state.phase !== "ended" &&
      Date.now() - data.timestamp > STALE_THRESHOLD_MS
    ) {
      data.state = { ...data.state, phase: "idle", currentStep: 0, etaSeconds: null };
    }

    return { state: data.state, alertHistory: data.alertHistory, launcher: data.launcher };
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STATE_KEY);
  } catch {
    // silently fail
  }
}

export function saveUserCity(city: string): void {
  try {
    localStorage.setItem(CITY_KEY, city);
  } catch {
    // silently fail
  }
}

export function loadUserCity(): string | null {
  try {
    return localStorage.getItem(CITY_KEY);
  } catch {
    return null;
  }
}

export function saveShowOnlyMyArea(val: boolean): void {
  try {
    localStorage.setItem("haoref-show-my-area", val ? "1" : "0");
  } catch {
    // silently fail
  }
}

export function loadShowOnlyMyArea(): boolean {
  try {
    return localStorage.getItem("haoref-show-my-area") === "1";
  } catch {
    return false;
  }
}
