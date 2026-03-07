import { OrefAlert } from "./types";

export const MOCK_IRAN_EARLY_WARNING: OrefAlert = {
  id: "mock-iran-ew-1",
  cat: "10",
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

// Funny Wolt-style "order" names
export const ORDER_DESCRIPTIONS = [
  "שווארמה בליסטית",
  "פלאפל מונחה GPS",
  "חומוס עם תוספות נפץ",
  "פיצה עם אננס וראש נפץ",
  "קבב בין-יבשתי",
  "ג׳חנון מהירות על-קולית",
  "מלאווח מרחף",
  "סביח מפוצל ראשי",
  "בורקס חודר מגן",
  "שקשוקה טרנס-אטמוספרית",
  "חומוס עילי עם טחינה",
  "שניצל פטריוט",
  "קציצות ברזל",
  "עראייס על-קוליות",
];

export function getRandomOrder(): string {
  return ORDER_DESCRIPTIONS[Math.floor(Math.random() * ORDER_DESCRIPTIONS.length)];
}

// Driver messages per phase
export const DRIVER_MESSAGES = {
  earlyWarning: [
    "ההזמנה התקבלה, מתחיל להכין 👨‍🍳",
    "אני כבר במטבח, רגע",
    "מחמם את המנוע",
    "אוסף את ההזמנה מהמסעדה",
    "סליחה, עוד דקה מחפש חנייה למשגר",
  ],
  missiles: [
    "אני בדרך! 🛵",
    "סליחה על העיכוב, פקקים בגבול",
    "עוד 2 דקות בערך",
    "מישהו הזמין חומוס?",
    "אני כבר ליד, תצאו לקבל",
    "מעביר בין נתיבים, סליחה על הרוח",
  ],
  ended: [
    "השארתי בפתח הממ״ד 📦",
    "תודה על ההזמנה! 🙏",
    "אל תשכחו טיפ",
    "מקווה שנהניתם, להתראות!",
    "5 כוכבים? בבקשה? 🥺",
  ],
};

export function getDriverMessage(phase: "earlyWarning" | "missiles" | "ended"): string {
  const messages = DRIVER_MESSAGES[phase];
  return messages[Math.floor(Math.random() * messages.length)];
}
