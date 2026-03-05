import { useState, useEffect } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
}

// Calibrated against SVG map control points:
// Tel Aviv (32.08, 34.78) → SVG (185, 195)
// Tehran (35.69, 51.39) → SVG (380, 160)
// Beirut (33.89, 35.50) → SVG (190, 175)
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = lng * 11.74 - 223.3;
  const y = lat * -9.695 + 506;
  return { x, y };
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}, // silently fail
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const svgPoint = position ? geoToSvg(position.lat, position.lng) : null;

  return { position, svgPoint };
}
