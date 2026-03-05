import { MissileOrigin, OrefAlert } from "@/lib/types";

interface Props {
  isActive: boolean;
  origin: MissileOrigin;
  etaSeconds: number | null;
  launcher: string;
  affectedCities: string[];
  latestAlert: OrefAlert | null;
}

function formatEta(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const ORIGIN_LABELS: Record<string, string> = {
  iran: "איראן",
  lebanon: "לבנון",
};

export function AlertCard({
  isActive,
  origin,
  etaSeconds,
  launcher,
  affectedCities,
  latestAlert,
}: Props) {
  // "האירוע הסתיים" — event ended, show all-clear
  if (!isActive && latestAlert?.title === "האירוע הסתיים") {
    return (
      <div className="bg-green-700 text-white px-4 py-6 text-center">
        <p className="text-xl font-bold">האירוע הסתיים</p>
        <p className="text-sm opacity-90 mt-1">{latestAlert.desc}</p>
        <p className="text-sm opacity-70 mt-2">ההזמנה הבאה בקרוב... 🥙</p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="bg-oref-blue text-white px-4 py-6 text-center">
        <p className="text-xl font-bold">אין התראות פעילות</p>
        <p className="text-sm opacity-70 mt-1">המשגר בהפסקת צהריים 🥙</p>
      </div>
    );
  }

  return (
    <div className="bg-oref-blue text-white px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🚀</span>
        <h2 className="text-xl font-bold">הטיל בדרך!</h2>
      </div>
      {etaSeconds !== null && (
        <p className="text-lg font-bold">
          זמן הגעה משוער: {formatEta(etaSeconds)}
        </p>
      )}
      {origin && (
        <p className="text-sm opacity-90">מקור: {ORIGIN_LABELS[origin]}</p>
      )}
      <p className="text-sm opacity-70">המשגר: {launcher}</p>
      {affectedCities.length > 0 && (
        <div className="mt-2 text-sm">
          <p className="font-bold">אזורים מאוימים:</p>
          <p className="opacity-90">{affectedCities.slice(0, 5).join(", ")}</p>
          {affectedCities.length > 5 && (
            <p className="opacity-70">
              ועוד {affectedCities.length - 5} אזורים...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
