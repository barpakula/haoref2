import { MissileOrigin, EventPhase, OrefAlert } from "@/lib/types";
import { isCityNearUser } from "@/lib/cities";

interface Props {
  phase: EventPhase;
  origin: MissileOrigin;
  etaSeconds: number | null;
  launcher: string;
  affectedCities: string[];
  missileWaves: number;
  latestAlert: OrefAlert | null;
  orderName: string;
  userCity: string | null;
}

function formatEta(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const ORIGIN_LABELS: Record<string, string> = {
  iran: "\u05D0\u05D9\u05E8\u05D0\u05DF",
  lebanon: "\u05DC\u05D1\u05E0\u05D5\u05DF",
};

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function AlertCard({
  phase,
  origin,
  etaSeconds,
  launcher,
  affectedCities,
  missileWaves,
  latestAlert,
  orderName,
  userCity,
}: Props) {
  // EVENT ENDED
  if (phase === "ended") {
    return (
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card animate-slide-up">
        <div className="bg-gradient-to-bl from-wolt-green to-emerald-600 text-white px-5 py-6 text-center relative grain">
          <CheckCircleIcon className="mx-auto mb-2 opacity-90" />
          <p className="font-display text-xl">
            {"האירוע הסתיים"}
          </p>
          <p className="text-sm opacity-90 mt-1.5 font-medium">
            {"אפשר לצאת מהמרחב המוגן"}
          </p>
          {orderName && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5">
              <span className="text-sm">{orderName} — נמסר!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // IDLE
  if (phase === "idle") {
    return (
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card animate-slide-up">
        <div className="bg-gradient-to-bl from-wolt-dark to-gray-800 text-white px-5 py-6 text-center relative grain">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <p className="font-display text-xl opacity-90">
            {"\u05D0\u05D9\u05DF \u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA"}
          </p>
          <p className="text-sm text-white/50 mt-1.5 font-medium">
            {"\u05D4\u05DE\u05E9\u05D2\u05E8 \u05D1\u05D4\u05E4\u05E1\u05E7\u05EA \u05E6\u05D4\u05E8\u05D9\u05D9\u05DD"}
          </p>
          {userCity && (
            <p className="text-xs text-white/30 mt-2">
              📍 {userCity}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Check if user's city is in the affected area
  const userIsAffected = userCity
    ? affectedCities.some((city) => isCityNearUser(city, userCity))
    : null;

  // EARLY WARNING
  if (phase === "earlyWarning") {
    return (
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-alert alert-pulse animate-slide-up">
        <div className="bg-gradient-to-bl from-amber-500 to-orange-600 text-white px-5 py-5 relative grain">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <WarningIcon />
            </div>
            <div>
              <h2 className="font-display text-xl leading-tight">
                {"\u05D4\u05EA\u05E8\u05D0\u05D4 \u05DE\u05D5\u05E7\u05D3\u05DE\u05EA!"}
              </h2>
              <p className="text-sm text-white/80 font-medium">{"\u05D4\u05DE\u05E9\u05D2\u05E8:"} {launcher}</p>
            </div>
          </div>

          {orderName && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 mb-3 inline-flex items-center gap-1.5">
              <span className="text-xs">🧾</span>
              <span className="text-sm font-medium">{orderName}</span>
            </div>
          )}

          {etaSeconds !== null && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-white/70 font-medium mb-0.5">
                {"\u05D6\u05DE\u05DF \u05D4\u05D2\u05E2\u05D4 \u05DE\u05E9\u05D5\u05E2\u05E8"}
              </p>
              <p className="font-display text-3xl tracking-wider" dir="ltr">
                {formatEta(etaSeconds)}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            {origin && (
              <span className="bg-white/15 rounded-full px-3 py-1 text-sm font-medium">
                {"\u05DE\u05E7\u05D5\u05E8:"} {ORIGIN_LABELS[origin]}
              </span>
            )}
            <span className="bg-white/15 rounded-full px-3 py-1 text-sm font-medium">
              {"\u05D4\u05D9\u05DB\u05E0\u05E1\u05D5 \u05DC\u05DE\u05E8\u05D7\u05D1 \u05DE\u05D5\u05D2\u05DF"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // MISSILES ACTIVE
  return (
    <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-alert alert-pulse animate-slide-up">
      <div className="bg-gradient-to-bl from-red-600 to-red-800 text-white px-5 py-5 relative grain">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <RocketIcon />
          </div>
          <div>
            <h2 className="font-display text-xl leading-tight">
              {"\u05D4\u05D8\u05D9\u05DC \u05D1\u05D3\u05E8\u05DA!"}
            </h2>
            <p className="text-sm text-white/80 font-medium">{"\u05D4\u05DE\u05E9\u05D2\u05E8:"} {launcher}</p>
          </div>
        </div>

        {orderName && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 mb-3 inline-flex items-center gap-1.5">
            <span className="text-xs">🧾</span>
            <span className="text-sm font-medium">{orderName}</span>
          </div>
        )}

        {etaSeconds !== null && etaSeconds > 0 && (
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-3">
            <p className="text-xs text-white/70 font-medium mb-0.5">
              {"\u05D6\u05DE\u05DF \u05D4\u05D2\u05E2\u05D4 \u05DE\u05E9\u05D5\u05E2\u05E8"}
            </p>
            <p className="font-display text-3xl tracking-wider" dir="ltr">
              {formatEta(etaSeconds)}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {origin && (
            <span className="bg-white/15 rounded-full px-3 py-1 text-sm font-medium">
              {"\u05DE\u05E7\u05D5\u05E8:"} {ORIGIN_LABELS[origin]}
            </span>
          )}
          {missileWaves > 1 && (
            <span className="bg-white/25 rounded-full px-3 py-1 text-sm font-bold">
              {"\u05D2\u05DC"} {missileWaves}
            </span>
          )}
        </div>

        {/* User location status */}
        {userCity && userIsAffected !== null && (
          <div className={`rounded-xl px-4 py-2.5 mb-3 ${
            userIsAffected
              ? "bg-yellow-400/20 border border-yellow-300/30"
              : "bg-white/5"
          }`}>
            <p className={`text-sm font-bold ${userIsAffected ? "text-yellow-200" : "text-white/50"}`}>
              {userIsAffected
                ? `⚠️ ${userCity} — באזור המאויים!`
                : `✓ ${userCity} — לא באזור המאויים`
              }
            </p>
          </div>
        )}

        {affectedCities.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <p className="text-xs text-white/70 font-medium mb-2">
              {"\u05D0\u05D6\u05D5\u05E8\u05D9\u05DD \u05DE\u05D0\u05D5\u05D9\u05DE\u05D9\u05DD"} ({affectedCities.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {affectedCities.slice(0, 6).map((city) => {
                const isUserArea = userCity ? isCityNearUser(city, userCity) : false;
                return (
                  <span
                    key={city}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                      isUserArea
                        ? "bg-yellow-400/30 text-yellow-100 ring-1 ring-yellow-400/50"
                        : "bg-white/15"
                    }`}
                  >
                    {city}
                  </span>
                );
              })}
              {affectedCities.length > 6 && (
                <span className="bg-white/10 rounded-lg px-2.5 py-1 text-xs text-white/60">
                  +{affectedCities.length - 6}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
