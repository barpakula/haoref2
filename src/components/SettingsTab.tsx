interface Props {
  demoMode: boolean;
  onToggleDemo: () => void;
  onTriggerDemo: (scenario: "iran" | "lebanon") => void;
  onClear: () => void;
}

export function SettingsTab({
  demoMode,
  onToggleDemo,
  onTriggerDemo,
  onClear,
}: Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-oref-blue">הגדרות</h2>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">מצב דמו</span>
          <button
            onClick={onToggleDemo}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              demoMode ? "bg-oref-orange" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                demoMode ? "right-0.5" : "right-[calc(100%-22px)]"
              }`}
            />
          </button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-medium">הפעל תרחיש</h3>
          <button
            onClick={() => onTriggerDemo("iran")}
            className="w-full bg-oref-orange text-white py-2 rounded-lg font-bold"
          >
            תרחיש איראן (התראה מוקדמת + טילים)
          </button>
          <button
            onClick={() => onTriggerDemo("lebanon")}
            className="w-full bg-oref-blue text-white py-2 rounded-lg font-bold"
          >
            תרחיש לבנון (טילים ישירים)
          </button>
          <button
            onClick={onClear}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold"
          >
            נקה התראות
          </button>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 mt-8">
        <p>הטיל בדרך! v1.0</p>
        <p>פרויקט סאטירי. לא קשור לפיקוד העורף.</p>
        <p>Stay safe.</p>
      </div>
    </div>
  );
}
