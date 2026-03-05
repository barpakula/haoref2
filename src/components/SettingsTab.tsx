import { useHaptics } from "@/hooks/useHaptics";

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
  const haptics = useHaptics();

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-wolt-dark px-1">{"\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA"}</h2>

      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-wolt-dark">{"\u05DE\u05E6\u05D1 \u05D3\u05DE\u05D5"}</span>
            <p className="text-xs text-gray-400 mt-0.5">{"\u05DC\u05D1\u05D3\u05D9\u05E7\u05D4 \u05D1\u05DC\u05D9 \u05D4\u05EA\u05E8\u05D0\u05D5\u05EA \u05D0\u05DE\u05D9\u05EA\u05D9\u05D5\u05EA"}</p>
          </div>
          <button
            onClick={() => {
              haptics.tap();
              onToggleDemo();
            }}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              demoMode ? "bg-wolt-blue" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                demoMode ? "right-1" : "right-[calc(100%-24px)]"
              }`}
            />
          </button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3 animate-slide-up">
          <h3 className="font-bold text-sm text-wolt-dark">{"\u05D4\u05E4\u05E2\u05DC \u05EA\u05E8\u05D7\u05D9\u05E9"}</h3>
          <button
            onClick={() => {
              haptics.heavy();
              onTriggerDemo("iran");
            }}
            className="w-full bg-gradient-to-l from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
          >
            {"\u05EA\u05E8\u05D7\u05D9\u05E9 \u05D0\u05D9\u05E8\u05D0\u05DF"} ({"\u05D4\u05EA\u05E8\u05D0\u05D4 \u05DE\u05D5\u05E7\u05D3\u05DE\u05EA"} + {"\u05D8\u05D9\u05DC\u05D9\u05DD"})
          </button>
          <button
            onClick={() => {
              haptics.heavy();
              onTriggerDemo("lebanon");
            }}
            className="w-full bg-gradient-to-l from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
          >
            {"\u05EA\u05E8\u05D7\u05D9\u05E9 \u05DC\u05D1\u05E0\u05D5\u05DF"} ({"\u05D8\u05D9\u05DC\u05D9\u05DD \u05D9\u05E9\u05D9\u05E8\u05D9\u05DD"})
          </button>
          <button
            onClick={() => {
              haptics.tap();
              onClear();
            }}
            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
          >
            {"\u05E0\u05E7\u05D4 \u05D4\u05EA\u05E8\u05D0\u05D5\u05EA"}
          </button>
        </div>
      )}

      <div className="text-center pt-6 pb-2">
        <p className="font-display text-sm text-gray-300">HaOref Eats v2.0</p>
        <p className="text-[11px] text-gray-300 mt-1">{"\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8 \u05E1\u05D0\u05D8\u05D9\u05E8\u05D9. \u05DC\u05D0 \u05E7\u05E9\u05D5\u05E8 \u05DC\u05E4\u05D9\u05E7\u05D5\u05D3 \u05D4\u05E2\u05D5\u05E8\u05E3."}</p>
        <p className="text-[11px] text-gray-300 mt-0.5">Stay safe.</p>
      </div>
    </div>
  );
}
