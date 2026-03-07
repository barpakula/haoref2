import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MissileOrigin } from "@/lib/types";
import { useGeolocation } from "@/hooks/useGeolocation";

interface Props {
  origin: MissileOrigin;
  isActive: boolean;
}

const COORDS = {
  israel: { lat: 31.5, lng: 34.8 },
  iran: { lat: 33.5, lng: 50.5 },
  lebanon: { lat: 33.85, lng: 35.85 },
};

// Generate arc points between two coordinates via a quadratic bezier
function computeArc(
  from: [number, number],
  to: [number, number],
  numPoints = 60
): [number, number][] {
  const midLat = (from[0] + to[0]) / 2 + Math.abs(from[0] - to[0]) * 0.6;
  const midLng = (from[1] + to[1]) / 2;
  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat =
      (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * midLat + t * t * to[0];
    const lng =
      (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * midLng + t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

// Custom SVG icon factory
function svgIcon(color: string, size: number, pulse = false): L.DivIcon {
  const pulseRing = pulse
    ? `<div style="position:absolute;inset:-8px;border:2px solid ${color};border-radius:50%;animation:leaflet-ping 1.5s ease-out infinite;opacity:0.5"></div>`
    : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="position:relative;width:${size}px;height:${size}px">
      ${pulseRing}
      <div style="width:${size}px;height:${size}px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>
    </div>`,
  });
}

function userIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
        <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.3 21.7 0 14 0z" fill="#3B82F6" stroke="white" stroke-width="2"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
      </svg>
    </div>`,
  });
}

// Dashed guide line (full path)
function GuideLine({ positions }: { positions: [number, number][] }) {
  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#94A3B8",
        weight: 1.5,
        dashArray: "4 4",
        opacity: 0.4,
      }}
    />
  );
}

// Missile emoji moving along the arc
function MovingMissile({
  positions,
  duration,
}: {
  positions: [number, number][];
  duration: number;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map || positions.length < 2) return;

    const makeIcon = (angleDeg: number) =>
      L.divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<div style="font-size:22px;line-height:1;transform:rotate(${angleDeg}deg);display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚀</div>`,
      });

    const marker = L.marker(positions[0], { icon: makeIcon(0) }).addTo(map);
    markerRef.current = marker;

    let animFrame: number;
    let startTime: number | null = null;
    let lastIdx = -1;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      // Loop: use modulo so it restarts automatically
      const elapsed = (timestamp - startTime) % duration;
      const t = elapsed / duration;
      const idx = Math.min(
        Math.floor(t * (positions.length - 1)),
        positions.length - 2
      );

      if (idx !== lastIdx) {
        lastIdx = idx;
        const pos = positions[idx];
        const next = positions[idx + 1];
        // Compute bearing for rotation (dy=lat diff, dx=lng diff)
        const dy = next[0] - pos[0];
        const dx = next[1] - pos[1];
        const bearing = Math.atan2(dx, dy) * (180 / Math.PI);
        // 🚀 emoji points northeast by default (~45°), so subtract 45
        marker.setIcon(makeIcon(bearing - 45));
      }

      marker.setLatLng(positions[idx]);
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      map.removeLayer(marker);
      markerRef.current = null;
    };
  }, [map, positions, duration]);

  return null;
}

export function MissileMap({ origin, isActive }: Props) {
  const { position } = useGeolocation();

  const fromCoord = origin === "iran" ? COORDS.iran : COORDS.lebanon;
  const toCoord = COORDS.israel;

  const arcPoints = useMemo(() => {
    if (!origin) return [];
    return computeArc(
      [fromCoord.lat, fromCoord.lng],
      [toCoord.lat, toCoord.lng]
    );
  }, [origin, fromCoord.lat, fromCoord.lng, toCoord.lat, toCoord.lng]);

  // Center/zoom based on origin
  const center: [number, number] = origin === "iran"
    ? [32.5, 43]
    : origin === "lebanon"
    ? [32.5, 35.5]
    : [31.5, 35];
  const zoom = origin === "iran" ? 4.5 : origin === "lebanon" ? 7 : 7;

  // Animation duration: Iran = 45s loop (long distance), Lebanon = 20s loop
  const missileDuration = origin === "iran" ? 45000 : 20000;

  const originIcon = useMemo(() => svgIcon("#F59E0B", 14, true), []);
  const targetIcon = useMemo(() => svgIcon("#EF4444", 14, true), []);
  const userPinIcon = useMemo(() => userIcon(), []);

  return (
    <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card animate-slide-up">
      <style>{`
        @keyframes leaflet-ping {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-container {
          font-family: 'Rubik', sans-serif;
          background: #F8FAFC;
        }
        .leaflet-control-attribution {
          font-size: 8px !important;
          background: rgba(255,255,255,0.7) !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
          color: #1B1B1F !important;
          border: none !important;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        attributionControl={true}
        style={{ height: "280px", width: "100%" }}
        key={`${origin}-${isActive}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Trajectory */}
        {isActive && origin && arcPoints.length > 0 && (
          <>
            <GuideLine positions={arcPoints} />
            <MovingMissile positions={arcPoints} duration={missileDuration} />
            <Marker
              position={[fromCoord.lat, fromCoord.lng]}
              icon={originIcon}
            />
            <Marker
              position={[toCoord.lat, toCoord.lng]}
              icon={targetIcon}
            />
          </>
        )}

        {/* User location */}
        {position && (
          <Marker
            position={[position.lat, position.lng]}
            icon={userPinIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
