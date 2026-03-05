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

  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto relative">
      <Header />

      {tab === "map" && (
        <>
          <DeliveryStepper currentStep={state.currentStep} />
          <AlertCard
            isActive={state.isActive}
            origin={state.origin}
            etaSeconds={state.etaSeconds}
            launcher={launcher}
            affectedCities={state.affectedCities}
            latestAlert={state.alerts[0] ?? null}
          />
          <MissileMap origin={state.origin} isActive={state.isActive} />
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
