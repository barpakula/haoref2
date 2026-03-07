import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { DeliveryStepper } from "@/components/DeliveryStepper";
import { AlertCard } from "@/components/AlertCard";
import { DriverMessage } from "@/components/DriverMessage";
import { RatingCard } from "@/components/RatingCard";
import { MissileMap } from "@/components/MissileMap";
import { BottomNav, TabId } from "@/components/BottomNav";
import { AlertsTab } from "@/components/AlertsTab";
import { HistoryTab } from "@/components/HistoryTab";
import { SettingsTab } from "@/components/SettingsTab";
import { useAlerts } from "@/hooks/useAlerts";
import { useHaptics } from "@/hooks/useHaptics";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function App() {
  const [tab, setTab] = useState<TabId>("map");
  const [demoMode, setDemoMode] = useState(
    () => new URLSearchParams(window.location.search).has("demo")
  );
  const { state, launcher, alertHistory, clearAlerts, triggerDemo } = useAlerts(demoMode);
  const haptics = useHaptics();
  const prevPhaseRef = useRef(state.phase);
  const {
    userCity,
    setUserCity,
    showOnlyMyArea,
    setShowOnlyMyArea,
    detecting,
    detectLocation,
    allCities,
  } = useUserLocation();

  const isActive = state.phase === "earlyWarning" || state.phase === "missiles";

  // Haptic feedback on phase transitions
  useEffect(() => {
    if (prevPhaseRef.current !== state.phase) {
      if (state.phase === "earlyWarning") haptics.heavy();
      else if (state.phase === "missiles") haptics.alert();
      else if (state.phase === "ended") haptics.success();
      prevPhaseRef.current = state.phase;
    }
  }, [state.phase]);

  return (
    <div className="min-h-screen bg-wolt-bg pb-20 max-w-md mx-auto relative">
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
            orderName={state.orderName}
            userCity={userCity}
          />
          <DriverMessage phase={state.phase} launcher={launcher} />
          {state.phase === "ended" && (
            <RatingCard launcher={launcher} orderName={state.orderName} />
          )}
          <MissileMap origin={state.origin} isActive={isActive} />
        </>
      )}

      {tab === "alerts" && (
        <AlertsTab
          alerts={state.alerts}
          userCity={userCity}
          showOnlyMyArea={showOnlyMyArea}
        />
      )}
      {tab === "history" && <HistoryTab history={alertHistory} />}
      {tab === "settings" && (
        <SettingsTab
          demoMode={demoMode}
          onToggleDemo={() => setDemoMode((d) => !d)}
          onTriggerDemo={triggerDemo}
          onClear={clearAlerts}
          userCity={userCity}
          onSetCity={setUserCity}
          showOnlyMyArea={showOnlyMyArea}
          onToggleShowOnlyMyArea={setShowOnlyMyArea}
          detecting={detecting}
          onDetectLocation={detectLocation}
          allCities={allCities}
        />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
