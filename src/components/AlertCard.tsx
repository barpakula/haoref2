import { MissileOrigin, EventPhase, OrefAlert } from "@/lib/types";

interface Props {
  phase: EventPhase;
  origin: MissileOrigin;
  etaSeconds: number | null;
  launcher: string;
  affectedCities: string[];
  missileWaves: number;
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

const PHASE_TITLES: Record<EventPhase, string> = {
  idle: "",
  earlyWarning: "התראה מוקדמת!",
  missiles: "הטיל בדרך!",
  ended: "האירוע הסתיים",
};

export function AlertCard({
  phase,
  origin,
  etaSeconds,
  launcher,
  affectedCities,
  missileWaves,
  latestAlert,
}: Props) {
  // EVENT ENDED
  if (phase === "ended") {
    return (
      <div className="bg-green-700 text-white px-4 py-6 text-center">
        <p className="text-xl font-bold">האירוע הסתיים</p>
        <p className="text-sm opacity-90 mt-1">
          {latestAlert?.desc || "אפשר לצאת מהמרחב המוגן"}
        </p>
        <p className="text-sm opacity-70 mt-2">ההזמנה הבאה בקרוב... 🥙</p>
      </div>
    );
  }

  // IDLE
  if (phase === "idle") {
    return (
      <div className="bg-oref-blue text-white px-4 py-6 text-center">
        <p className="text-xl font-bold">אין התראות פעילות</p>
        <p className="text-sm opacity-70 mt-1">המשגר בהפסקת צהריים 🥙</p>
      </div>
    );
  }

  // EARLY WARNING
  if (phase === "earlyWarning") {
    return (
      <div className="bg-oref-orange text-white px-4 py-4 alert-pulse">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-xl font-bold">{PHASE_TITLES.earlyWarning}</h2>
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
        <p className="text-sm mt-2 opacity-90">
          התכוננו להיכנס למרחב המוגן
        </p>
      </div>
    );
  }

  // MISSILES ACTIVE
  return (
    <div className="bg-red-700 text-white px-4 py-4 alert-pulse">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🚀</span>
        <h2 className="text-xl font-bold">{PHASE_TITLES.missiles}</h2>
      </div>
      {etaSeconds !== null && etaSeconds > 0 && (
        <p className="text-lg font-bold">
          זמן הגעה משוער: {formatEta(etaSeconds)}
        </p>
      )}
      {origin && (
        <p className="text-sm opacity-90">מקור: {ORIGIN_LABELS[origin]}</p>
      )}
      <p className="text-sm opacity-70">המשגר: {launcher}</p>
      {missileWaves > 1 && (
        <p className="text-sm font-bold mt-1">גל {missileWaves} של טילים</p>
      )}
      {affectedCities.length > 0 && (
        <div className="mt-2 text-sm">
          <p className="font-bold">אזורים מאוימים ({affectedCities.length}):</p>
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
