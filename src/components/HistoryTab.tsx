import { OrefAlert } from "@/lib/types";

interface Props {
  history: OrefAlert[];
}

export function HistoryTab({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>אין היסטוריית התראות</p>
        <p className="text-sm mt-1">ההתראות יצטברו כאן במהלך השימוש</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {history.map((alert, i) => (
        <div
          key={`${alert.id}-${i}`}
          className={`bg-white rounded-lg p-3 shadow-sm text-sm border ${
            alert.title === "האירוע הסתיים"
              ? "border-green-200"
              : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-bold ${
                alert.title === "האירוע הסתיים"
                  ? "text-green-700"
                  : "text-oref-blue"
              }`}
            >
              {alert.title}
            </span>
            <span className="text-xs text-gray-400">cat {alert.cat}</span>
          </div>
          {alert.desc && (
            <p className="text-gray-500 mt-1 text-xs">{alert.desc}</p>
          )}
          {alert.data.length > 0 && (
            <div className="text-gray-600 mt-1">
              {alert.data.slice(0, 3).join(", ")}
              {alert.data.length > 3 && ` ועוד ${alert.data.length - 3}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
