import { OrefAlert } from "@/lib/types";

interface Props {
  history: OrefAlert[];
}

export function HistoryTab({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="text-lg font-bold text-wolt-dark">{"\u05D0\u05D9\u05DF \u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05D4\u05EA\u05E8\u05D0\u05D5\u05EA"}</p>
        <p className="text-sm text-gray-400 mt-1">{"\u05D4\u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D9\u05E6\u05D8\u05D1\u05E8\u05D5 \u05DB\u05D0\u05DF \u05D1\u05DE\u05D4\u05DC\u05DA \u05D4\u05E9\u05D9\u05DE\u05D5\u05E9"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2.5">
      {history.map((alert, i) => {
        const isEnded = alert.title === "\u05D4\u05D0\u05D9\u05E8\u05D5\u05E2 \u05D4\u05E1\u05EA\u05D9\u05D9\u05DD";
        return (
          <div
            key={`${alert.id}-${i}`}
            className="bg-white rounded-2xl p-4 shadow-card animate-slide-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isEnded ? "bg-wolt-green" : "bg-wolt-red"
                  }`}
                />
                <span
                  className={`font-bold text-sm ${
                    isEnded ? "text-wolt-green" : "text-wolt-dark"
                  }`}
                >
                  {alert.title}
                </span>
              </div>
              <span className="text-[10px] text-gray-300 font-medium bg-gray-50 rounded px-1.5 py-0.5">
                cat {alert.cat}
              </span>
            </div>
            {alert.desc && (
              <p className="text-xs text-gray-400 mt-1">{alert.desc}</p>
            )}
            {alert.data.length > 0 && (
              <p className="text-xs text-gray-500 mt-1.5">
                {alert.data.slice(0, 3).join(", ")}
                {alert.data.length > 3 && ` \u05D5\u05E2\u05D5\u05D3 ${alert.data.length - 3}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
