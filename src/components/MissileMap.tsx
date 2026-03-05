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

// Animated polyline that draws itself
function AnimatedArc({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  const polyRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!map || positions.length === 0) return;

    // Draw trajectory line
    const line = L.polyline(positions, {
      color: "#EF4444",
      weight: 3,
      opacity: 0,
      dashArray: "8 6",
    }).addTo(map);

    // Animate in
    let frame: number;
    let progress = 0;
    const animate = () => {
      progress += 0.02;
      if (progress > 1) progress = 1;
      const count = Math.floor(positions.length * progress);
      const partial = positions.slice(0, count);
      if (partial.length > 1) {
        line.setLatLngs(partial);
        line.setStyle({ opacity: 0.8 });
      }
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    polyRef.current = line;

    return () => {
      cancelAnimationFrame(frame);
      map.removeLayer(line);
    };
  }, [map, positions]);

  return null;
}

// Dashed guide line (full path, lighter)
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
            <AnimatedArc positions={arcPoints} />
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
