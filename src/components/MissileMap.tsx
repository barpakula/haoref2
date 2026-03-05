import { MissileOrigin } from "@/lib/types";

interface Props {
  origin: MissileOrigin;
  isActive: boolean;
}

const ISRAEL = { x: 185, y: 195 };
const IRAN = { x: 380, y: 160 };
const LEBANON = { x: 190, y: 175 };

function getArcPath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 60;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export function MissileMap({ origin, isActive }: Props) {
  const fromPoint = origin === "iran" ? IRAN : LEBANON;
  const arcPath = origin ? getArcPath(fromPoint, ISRAEL) : "";

  return (
    <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card animate-slide-up bg-white">
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        <svg viewBox="0 0 500 375" className="w-full h-full">
          {/* Gradient defs */}
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
            <linearGradient id="iranGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="lebGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="israelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="500" height="375" fill="#F8FAFC" />

          {/* Water bodies */}
          <ellipse cx="120" cy="200" rx="80" ry="120" fill="url(#seaGrad)" />
          <path d="M 140 280 L 155 375 L 175 375 L 160 280 Z" fill="url(#seaGrad)" />
          <path d="M 380 200 L 420 230 L 400 260 L 370 240 Z" fill="url(#seaGrad)" opacity="0.7" />

          {/* Countries */}
          <path d="M 100 80 L 300 60 L 320 100 L 280 120 L 200 130 L 100 120 Z" fill="url(#landGrad)" stroke="#C4C8CE" strokeWidth="0.5" />
          <path d="M 200 130 L 280 120 L 290 170 L 230 180 L 200 160 Z" fill="url(#landGrad)" stroke="#C4C8CE" strokeWidth="0.5" />
          <path d="M 280 120 L 350 110 L 370 180 L 310 200 L 290 170 Z" fill="url(#landGrad)" stroke="#C4C8CE" strokeWidth="0.5" />
          <path
            d="M 350 110 L 450 80 L 480 150 L 460 220 L 400 240 L 370 180 Z"
            fill={origin === "iran" ? "url(#iranGrad)" : "url(#landGrad)"}
            stroke={origin === "iran" ? "#D97706" : "#C4C8CE"}
            strokeWidth={origin === "iran" ? "1.5" : "0.5"}
            className="transition-all duration-700"
          />
          <path
            d="M 192 165 L 200 160 L 202 178 L 194 180 Z"
            fill={origin === "lebanon" ? "url(#lebGrad)" : "url(#landGrad)"}
            stroke={origin === "lebanon" ? "#D97706" : "#C4C8CE"}
            strokeWidth={origin === "lebanon" ? "1.5" : "0.5"}
            className="transition-all duration-700"
          />
          <path d="M 182 180 L 194 180 L 196 210 L 190 230 L 182 210 Z" fill="url(#israelGrad)" stroke="white" strokeWidth="1.5" />
          <path d="M 200 180 L 230 180 L 250 230 L 210 260 L 196 210 Z" fill="url(#landGrad)" stroke="#C4C8CE" strokeWidth="0.5" />
          <path d="M 210 260 L 350 240 L 380 320 L 200 375 L 160 300 Z" fill="#E5E7EB" stroke="#C4C8CE" strokeWidth="0.5" />
          <path d="M 100 200 L 160 190 L 182 210 L 160 300 L 100 340 L 80 280 Z" fill="url(#landGrad)" stroke="#C4C8CE" strokeWidth="0.5" />
          <path d="M 160 300 L 200 375 L 180 375 L 140 310 Z" fill="url(#seaGrad)" />

          {/* Country labels */}
          <text x="400" y="160" fill="#78716C" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="Rubik">{"\u05D0\u05D9\u05E8\u05D0\u05DF"}</text>
          <text x="186" y="200" fill="white" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="Rubik">IL</text>
          <text x="196" y="170" fill="#78716C" fontSize="5.5" textAnchor="middle" fontFamily="Rubik">{"\u05DC\u05D1\u05F3"}</text>
          <text x="240" y="155" fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05E1\u05D5\u05E8\u05D9\u05D4"}</text>
          <text x="310" y="155" fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05E2\u05D9\u05E8\u05D0\u05E7"}</text>
          <text x="200" y="100" fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05D8\u05D5\u05E8\u05E7\u05D9\u05D4"}</text>
          <text x="130" y="270" fill="#9CA3AF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05DE\u05E6\u05E8\u05D9\u05DD"}</text>

          {/* Trajectory */}
          {isActive && origin && (
            <g>
              {/* Dashed background path */}
              <path
                d={arcPath}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.3"
              />
              {/* Animated foreground path */}
              <path
                d={arcPath}
                fill="none"
                stroke="#009DE0"
                strokeWidth="2.5"
                strokeDasharray="200"
                strokeDashoffset="200"
                className="animate-trajectory"
                filter="url(#glow)"
              />
              {/* Origin pulse */}
              <circle cx={fromPoint.x} cy={fromPoint.y} r="12" fill="url(#pulseGlow)" className="animate-pulse" />
              <circle cx={fromPoint.x} cy={fromPoint.y} r="4" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
              {/* Target pulse */}
              <circle cx={ISRAEL.x} cy={ISRAEL.y} r="12" fill="url(#pulseGlow)" className="animate-pulse" />
              <circle cx={ISRAEL.x} cy={ISRAEL.y} r="4" fill="#EF4444" stroke="white" strokeWidth="1.5" />

              {/* Rocket along path */}
              <path id="missilePath" d={arcPath} fill="none" stroke="none" />
              <text fontSize="14" filter="url(#glow)">
                <textPath href="#missilePath" startOffset="55%">
                  {"\uD83D\uDE80"}
                </textPath>
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
