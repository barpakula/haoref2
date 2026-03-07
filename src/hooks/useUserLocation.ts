import { useState, useEffect, useCallback } from "react";
import { findNearestCity, getAllCityNames } from "@/lib/cities";
import { loadUserCity, saveUserCity, loadShowOnlyMyArea, saveShowOnlyMyArea } from "@/lib/storage";

export function useUserLocation() {
  const [userCity, setUserCityState] = useState<string | null>(() => loadUserCity());
  const [showOnlyMyArea, setShowOnlyMyAreaState] = useState(() => loadShowOnlyMyArea());
  const [detecting, setDetecting] = useState(false);

  const setUserCity = useCallback((city: string) => {
    setUserCityState(city);
    saveUserCity(city);
  }, []);

  const setShowOnlyMyArea = useCallback((val: boolean) => {
    setShowOnlyMyAreaState(val);
    saveShowOnlyMyArea(val);
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setUserCity(nearest);
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, [setUserCity]);

  // Auto-detect on first launch if no city is saved
  useEffect(() => {
    if (!userCity) {
      detectLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    userCity,
    setUserCity,
    showOnlyMyArea,
    setShowOnlyMyArea,
    detecting,
    detectLocation,
    allCities: getAllCityNames(),
  };
}
