export interface OrefAlert {
  id: string;
  cat: string;
  title: string;
  data: string[];
  desc: string;
}

export type MissileOrigin = "iran" | "lebanon" | null;

// Event phases: idle → earlyWarning → missiles → ended
export type EventPhase = "idle" | "earlyWarning" | "missiles" | "ended";

export interface TrackerState {
  phase: EventPhase;
  origin: MissileOrigin;
  alerts: OrefAlert[];
  earlyWarningTime: number | null;
  currentStep: number;
  etaSeconds: number | null;
  affectedCities: string[];   // accumulated across all waves
  missileWaves: number;        // how many cat-1 alerts received
}

export const ALERT_CATEGORIES: Record<string, string> = {
  "1": "ירי טילים ורקטות",
  "2": "אזעקת בדיקה",
  "3": "רעידת אדמה",
  "4": "סכנה כימית",
  "5": "צונאמי",
  "6": "חדירת כלי טיס",
  "10": "התראה מוקדמת - איראן",
  "13": "חדירת מחבלים",
  "14": "ידיעה מוקדמת",
};

// Cat 10 = Iran early warning (the real one from the API)
export const IRAN_EARLY_WARNING_CATS = ["10", "14"];
