import { useState } from "react";
import { Header } from "@/components/Header";
import { DeliveryStepper } from "@/components/DeliveryStepper";
import { AlertCard } from "@/components/AlertCard";
import { MissileMap } from "@/components/MissileMap";
import { BottomNav, TabId } from "@/components/BottomNav";
import { AlertsTab } from "@/components/AlertsTab";
import { HistoryTab } from "@/components/HistoryTab";
import { SettingsTab } from "@/components/SettingsTab";
import { useAlerts } from "@/hooks/useAlerts";

export default function App() {
  const [tab, setTab] = useState<TabId>("map");
  const [demoMode, setDemoMode] = useState(
    () => new URLSearchParams(window.location.search).has("demo")
  );
  const { state, launcher, alertHistory, clearAlerts, triggerDemo } = useAlerts(demoMode);

  const isActive = state.phase === "earlyWarning" || state.phase === "missiles";

  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto relative">
      <Header />

      {tab === "map" && (
        <>
          <DeliveryStepper currentStep={state.currentStep} />
          <AlertCard
            phase={state.phase}
            origin={state.origin}
            etaSeconds={state.etaSeconds}
            launcher={launcher}
            affectedCities={state.affectedCities}
            missileWaves={state.missileWaves}
            latestAlert={state.alerts[0] ?? null}
          />
          <MissileMap origin={state.origin} isActive={isActive} />
        </>
      )}

      {tab === "alerts" && <AlertsTab alerts={state.alerts} />}
      {tab === "history" && <HistoryTab history={alertHistory} />}
      {tab === "settings" && (
        <SettingsTab
          demoMode={demoMode}
          onToggleDemo={() => setDemoMode((d) => !d)}
          onTriggerDemo={triggerDemo}
          onClear={clearAlerts}
        />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
