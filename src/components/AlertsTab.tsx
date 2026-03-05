import { OrefAlert } from "@/lib/types";

interface Props {
  alerts: OrefAlert[];
}

export function AlertsTab({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <p className="text-lg font-bold text-wolt-dark">{"\u05D0\u05D9\u05DF \u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA"}</p>
        <p className="text-sm text-gray-400 mt-1">{"\u05E0\u05D5\u05D3\u05D9\u05E2 \u05DC\u05DA \u05DB\u05E9\u05D9\u05D4\u05D9\u05D4 \u05DE\u05E9\u05D4\u05D5 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {alerts.map((alert, i) => (
        <div
          key={`${alert.id}-${i}`}
          className="bg-white rounded-2xl p-4 shadow-card animate-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="font-bold text-wolt-dark">{alert.title}</span>
          </div>
          {alert.desc && (
            <p className="text-sm text-gray-500 mb-2">{alert.desc}</p>
          )}
          {alert.data.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {alert.data.map((city) => (
                <span
                  key={city}
                  className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
