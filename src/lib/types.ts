export interface OrefAlert {
  id: string;
  cat: string;
  title: string;
  data: string[];
  desc: string;
}

export type MissileOrigin = "iran" | "lebanon" | null;

export interface TrackerState {
  isActive: boolean;
  origin: MissileOrigin;
  alerts: OrefAlert[];
  earlyWarningTime: number | null;
  currentStep: number;
  etaSeconds: number | null;
  affectedCities: string[];
}

export const ALERT_CATEGORIES: Record<string, string> = {
  "1": "ירי טילים ורקטות",
  "2": "אזעקת בדיקה",
  "3": "רעידת אדמה",
  "4": "סכנה כימית",
  "5": "צונאמי",
  "6": "חדירת כלי טיס",
  "13": "חדירת מחבלים",
  "14": "ידיעה מוקדמת",
};
