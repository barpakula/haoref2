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
import { isCityNearUser } from "@/lib/cities";

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

  // If ended but user's city was never in the affected area, auto-clear to idle
  const userWasAffected = userCity
    ? state.affectedCities.some((c) => isCityNearUser(c, userCity))
    : state.affectedCities.length > 0;

  useEffect(() => {
    if (state.phase === "ended" && userCity && !userWasAffected) {
      const t = setTimeout(() => clearAlerts(), 1500);
      return () => clearTimeout(t);
    }
  }, [state.phase, userCity, userWasAffected]);

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
          <DriverMessage phase={state.phase} launcher={launcher} origin={state.origin} />
          {state.phase === "ended" && (
            <RatingCard launcher={launcher} orderName={state.orderName} />
          )}
          {state.phase !== "idle" && (
            <button
              onClick={() => {
                haptics.tap();
                clearAlerts();
              }}
              className="mx-4 mt-3 w-[calc(100%-2rem)] bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl font-medium text-sm active:scale-[0.98] transition-transform shadow-sm"
            >
              איפוס מצב
            </button>
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
