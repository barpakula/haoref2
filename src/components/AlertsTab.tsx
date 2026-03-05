import { OrefAlert } from "@/lib/types";

interface Props {
  alerts: OrefAlert[];
}

export function AlertsTab({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-lg">אין התראות פעילות</p>
        <p className="text-sm mt-1">נודיע לך כשיהיה משהו מעניין</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-bold">{alert.title}</span>
          </div>
          <p className="text-sm text-gray-600">{alert.desc}</p>
          {alert.data.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {alert.data.map((city) => (
                <span
                  key={city}
                  className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full"
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
