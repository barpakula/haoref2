import { clsx } from "clsx";

export type TabId = "map" | "alerts" | "history" | "settings";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "map", label: "מפה", icon: "🗺️" },
  { id: "alerts", label: "התראות", icon: "🔔" },
  { id: "history", label: "היסטוריה", icon: "🕐" },
  { id: "settings", label: "הגדרות", icon: "⚙️" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 safe-bottom">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
            active === tab.id
              ? "text-oref-blue"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
