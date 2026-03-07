// Pikud HaOref alert zone database with approximate coordinates
// Used for GPS → city matching and location-based alert filtering

export interface CityEntry {
  name: string;
  lat: number;
  lng: number;
}

// Major alert zones covering Israel. Names match Pikud HaOref's alert.data[] values.
export const CITY_DATABASE: CityEntry[] = [
  // Tel Aviv metro
  { name: "תל אביב - מרכז העיר", lat: 32.0853, lng: 34.7818 },
  { name: "תל אביב - מזרח", lat: 32.0730, lng: 34.8000 },
  { name: "תל אביב - דרום העיר", lat: 32.0550, lng: 34.7700 },
  { name: "תל אביב - יפו", lat: 32.0500, lng: 34.7500 },
  { name: "רמת גן", lat: 32.0880, lng: 34.8124 },
  { name: "גבעתיים", lat: 32.0716, lng: 34.8124 },
  { name: "בני ברק", lat: 32.0834, lng: 34.8340 },
  { name: "חולון", lat: 32.0114, lng: 34.7875 },
  { name: "בת ים", lat: 32.0236, lng: 34.7515 },
  { name: "פתח תקווה", lat: 32.0841, lng: 34.8878 },
  { name: "ראשון לציון - מזרח", lat: 31.9730, lng: 34.8100 },
  { name: "ראשון לציון - מערב", lat: 31.9600, lng: 34.7700 },
  { name: "הרצליה", lat: 32.1629, lng: 34.7915 },
  { name: "רעננה", lat: 32.1836, lng: 34.8708 },
  { name: "כפר סבא", lat: 32.1751, lng: 34.9066 },
  { name: "נתניה", lat: 32.3215, lng: 34.8532 },
  { name: "רחובות", lat: 31.8928, lng: 34.8113 },
  { name: "נס ציונה", lat: 31.9293, lng: 34.7985 },
  { name: "לוד", lat: 31.9515, lng: 34.8952 },
  { name: "רמלה", lat: 31.9275, lng: 34.8625 },
  { name: "מודיעין מכבים רעות", lat: 31.8969, lng: 35.0104 },

  // Jerusalem
  { name: "ירושלים - מרכז", lat: 31.7683, lng: 35.2137 },
  { name: "ירושלים - מזרח", lat: 31.7800, lng: 35.2400 },
  { name: "ירושלים - דרום", lat: 31.7400, lng: 35.2000 },
  { name: "ירושלים - מערב", lat: 31.7700, lng: 35.1900 },
  { name: "בית שמש", lat: 31.7468, lng: 34.9868 },
  { name: "מעלה אדומים", lat: 31.7770, lng: 35.3000 },

  // Haifa area
  { name: "חיפה - כרמל ועיר תחתית", lat: 32.7940, lng: 34.9896 },
  { name: "חיפה - מפרץ", lat: 32.8200, lng: 35.0400 },
  { name: "חיפה - נווה שאנן", lat: 32.7800, lng: 35.0100 },
  { name: "קריית אתא", lat: 32.8000, lng: 35.1000 },
  { name: "קריית ביאליק", lat: 32.8300, lng: 35.0800 },
  { name: "קריית מוצקין", lat: 32.8400, lng: 35.0700 },
  { name: "עכו", lat: 32.9276, lng: 35.0764 },

  // North
  { name: "נהריה", lat: 33.0040, lng: 35.0930 },
  { name: "קריית שמונה", lat: 33.2080, lng: 35.5710 },
  { name: "מטולה", lat: 33.2800, lng: 35.5730 },
  { name: "צפת", lat: 32.9646, lng: 35.4953 },
  { name: "טבריה", lat: 32.7922, lng: 35.5312 },
  { name: "כרמיאל", lat: 32.9114, lng: 35.2960 },
  { name: "עפולה", lat: 32.6072, lng: 35.2896 },
  { name: "נצרת", lat: 32.6996, lng: 35.3035 },

  // South
  { name: "באר שבע - מזרח", lat: 31.2600, lng: 34.8100 },
  { name: "באר שבע - מערב", lat: 31.2500, lng: 34.7700 },
  { name: "באר שבע - צפון", lat: 31.2700, lng: 34.7900 },
  { name: "אשדוד - א,ב,ד,ה", lat: 31.8040, lng: 34.6500 },
  { name: "אשדוד - ח,י,יא,יז", lat: 31.8100, lng: 34.6600 },
  { name: "אשקלון - צפון", lat: 31.6780, lng: 34.5740 },
  { name: "אשקלון - דרום", lat: 31.6600, lng: 34.5600 },
  { name: "שדרות", lat: 31.5250, lng: 34.5960 },
  { name: "אופקים", lat: 31.3150, lng: 34.6200 },
  { name: "דימונה", lat: 31.0700, lng: 35.0330 },
  { name: "אילת", lat: 29.5577, lng: 34.9519 },
  { name: "ערד", lat: 31.2610, lng: 35.2140 },
];

/** Haversine distance in km between two lat/lng points */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Find the nearest city in our database to the given GPS coordinates */
export function findNearestCity(lat: number, lng: number): string {
  let bestCity = CITY_DATABASE[0].name;
  let bestDist = Infinity;
  for (const city of CITY_DATABASE) {
    const dist = haversineKm(lat, lng, city.lat, city.lng);
    if (dist < bestDist) {
      bestDist = dist;
      bestCity = city.name;
    }
  }
  return bestCity;
}

/**
 * Check if a city from an alert is "near" the user's selected city.
 * We consider cities within 15km of each other as the same area,
 * or a direct name match (including partial — e.g., user has "חיפה - כרמל"
 * and alert has "חיפה - מפרץ" — same root city).
 */
export function isCityNearUser(alertCity: string, userCity: string): boolean {
  // Direct match
  if (alertCity === userCity) return true;

  // Same root city (e.g., "תל אביב - מרכז" and "תל אביב - מזרח")
  const rootAlert = alertCity.split(" - ")[0].trim();
  const rootUser = userCity.split(" - ")[0].trim();
  if (rootAlert === rootUser) return true;

  // Distance-based: look up coordinates for both and compare
  const alertEntry = CITY_DATABASE.find((c) => c.name === alertCity);
  const userEntry = CITY_DATABASE.find((c) => c.name === userCity);
  if (alertEntry && userEntry) {
    return haversineKm(alertEntry.lat, alertEntry.lng, userEntry.lat, userEntry.lng) < 15;
  }

  return false;
}

/** Look up coordinates for a city by name */
export function getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
  const entry = CITY_DATABASE.find((c) => c.name === cityName);
  return entry ? { lat: entry.lat, lng: entry.lng } : null;
}

/** Get all unique city names for the selector */
export function getAllCityNames(): string[] {
  return CITY_DATABASE.map((c) => c.name).sort((a, b) => a.localeCompare(b, "he"));
}
