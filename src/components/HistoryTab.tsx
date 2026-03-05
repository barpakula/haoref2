import { useState, useEffect } from "react";
import { OrefAlert } from "@/lib/types";

export function HistoryTab() {
  const [history, setHistory] = useState<OrefAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.text())
      .then((text) => {
        if (text && text.trim()) {
          const data = JSON.parse(text);
          setHistory(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">טוען היסטוריה...</div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>אין היסטוריית התראות</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {history.slice(0, 50).map((alert, i) => (
        <div
          key={`${alert.id}-${i}`}
          className="bg-white rounded-lg p-3 shadow-sm text-sm border border-gray-100"
        >
          <div className="font-bold text-oref-blue">{alert.title}</div>
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
