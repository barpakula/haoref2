import { OrefAlert } from "./types";

export const MOCK_IRAN_EARLY_WARNING: OrefAlert = {
  id: "mock-iran-ew-1",
  cat: "14",
  title: "ידיעה מוקדמת",
  data: [],
  desc: "ידיעה מוקדמת על שיגור טילים מאיראן",
};

export const MOCK_IRAN_MISSILES: OrefAlert = {
  id: "mock-iran-m-1",
  cat: "1",
  title: "ירי טילים ורקטות",
  data: [
    "תל אביב - מרכז העיר",
    "תל אביב - מזרח",
    "רמת גן",
    "גבעתיים",
    "חולון",
    "ירושלים - מרכז",
    "באר שבע - מזרח",
  ],
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות",
};

export const MOCK_LEBANON_MISSILES: OrefAlert = {
  id: "mock-leb-1",
  cat: "1",
  title: "ירי טילים ורקטות",
  data: [
    "קריית שמונה",
    "מטולה",
    "נהריה",
    "עכו",
    "חיפה - כרמל ועיר תחתית",
    "חיפה - מפרץ",
  ],
  desc: "היכנסו למרחב המוגן",
};

export const LAUNCHER_NAMES = [
  "ע. כרמניאן",
  "מ. חמינאי ג׳וניור",
  "חסן מהלוגיסטיקה",
  "עלי מהמשמרת",
  "אבו רקטה",
  "הנהג החדש",
];

export function getRandomLauncher(): string {
  return LAUNCHER_NAMES[Math.floor(Math.random() * LAUNCHER_NAMES.length)];
}
