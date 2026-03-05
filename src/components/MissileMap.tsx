import { MissileOrigin } from "@/lib/types";
import { useGeolocation } from "@/hooks/useGeolocation";

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
  const midY = Math.min(from.y, to.y) - 70;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

// More detailed country outlines for a cleaner look
const COUNTRIES = {
  turkey: "M 85 85 L 110 75 L 155 65 L 205 58 L 250 55 L 290 60 L 315 75 L 325 95 L 310 108 L 285 115 L 260 118 L 230 125 L 205 130 L 175 128 L 145 120 L 115 110 L 95 100 Z",
  syria: "M 205 130 L 230 125 L 260 118 L 285 115 L 290 135 L 288 155 L 275 168 L 248 175 L 230 178 L 210 170 L 200 155 Z",
  iraq: "M 285 115 L 310 108 L 340 110 L 360 115 L 372 135 L 375 160 L 370 180 L 355 195 L 330 200 L 310 198 L 295 185 L 288 170 L 288 155 L 290 135 Z",
  iran: "M 360 115 L 385 100 L 415 82 L 445 78 L 470 90 L 485 115 L 488 145 L 478 175 L 465 200 L 445 218 L 420 232 L 395 238 L 378 225 L 370 200 L 370 180 L 372 155 L 372 135 Z",
  lebanon: "M 193 163 L 198 158 L 202 162 L 204 172 L 202 178 L 197 180 L 194 175 Z",
  israel: "M 183 180 L 192 178 L 197 180 L 198 192 L 196 205 L 193 218 L 190 228 L 186 222 L 183 210 L 182 195 Z",
  jordan: "M 198 180 L 210 175 L 230 178 L 248 190 L 240 215 L 225 240 L 210 255 L 198 240 L 193 218 L 196 205 L 198 192 Z",
  saudiArabia: "M 210 255 L 240 245 L 280 235 L 320 232 L 355 240 L 375 260 L 380 290 L 365 320 L 330 345 L 280 365 L 230 375 L 195 370 L 175 345 L 165 310 L 175 280 L 195 265 Z",
  egypt: "M 85 200 L 120 192 L 150 188 L 170 186 L 183 195 L 183 210 L 175 240 L 165 270 L 160 295 L 150 315 L 130 335 L 105 345 L 85 335 L 75 305 L 75 270 L 78 240 L 80 215 Z",
};

const WATER = {
  mediterranean: "M 50 120 Q 80 140 95 175 Q 105 210 100 250 Q 95 280 105 300 L 130 335 L 105 345 L 65 340 L 40 300 L 30 250 L 35 200 L 45 160 Z",
  redSea: "M 155 295 L 168 310 L 175 345 L 185 370 L 200 375 L 175 375 L 160 365 L 145 340 L 140 315 Z",
  persianGulf: "M 375 200 L 395 210 L 420 232 L 410 248 L 395 255 L 378 245 L 370 228 L 370 210 Z",
};

export function MissileMap({ origin, isActive }: Props) {
  const fromPoint = origin === "iran" ? IRAN : LEBANON;
  const arcPath = origin ? getArcPath(fromPoint, ISRAEL) : "";
  const { svgPoint } = useGeolocation();

  return (
    <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card animate-slide-up bg-white">
      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
        <svg viewBox="0 0 500 375" className="w-full h-full">
          <defs>
            {/* Gradients */}
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#F3F4F6" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
            <linearGradient id="highlightGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="israelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="trajectoryGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.08" />
            </filter>
            <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
            </filter>

            <radialGradient id="pulseRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pulseOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pulseBlue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>

            {/* Grid pattern */}
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#E5E7EB" strokeWidth="0.3" opacity="0.5" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="500" height="375" fill="#F8FAFC" />
          <rect width="500" height="375" fill="url(#grid)" />

          {/* Water bodies */}
          <path d={WATER.mediterranean} fill="url(#seaGrad)" />
          <path d={WATER.redSea} fill="url(#seaGrad)" />
          <path d={WATER.persianGulf} fill="url(#seaGrad)" opacity="0.8" />

          {/* Country shapes */}
          <path d={COUNTRIES.turkey} fill="url(#landGrad)" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />
          <path d={COUNTRIES.syria} fill="url(#landGrad)" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />
          <path d={COUNTRIES.iraq} fill="url(#landGrad)" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />
          <path d={COUNTRIES.jordan} fill="url(#landGrad)" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />
          <path d={COUNTRIES.egypt} fill="url(#landGrad)" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />
          <path d={COUNTRIES.saudiArabia} fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.8" filter="url(#softShadow)" />

          {/* Highlighted countries */}
          <path
            d={COUNTRIES.iran}
            fill={origin === "iran" ? "url(#highlightGrad)" : "url(#landGrad)"}
            stroke={origin === "iran" ? "#D97706" : "#D1D5DB"}
            strokeWidth={origin === "iran" ? 1.5 : 0.8}
            filter="url(#softShadow)"
            className="transition-all duration-700"
          />
          <path
            d={COUNTRIES.lebanon}
            fill={origin === "lebanon" ? "url(#highlightGrad)" : "url(#landGrad)"}
            stroke={origin === "lebanon" ? "#D97706" : "#D1D5DB"}
            strokeWidth={origin === "lebanon" ? 1.5 : 0.8}
            className="transition-all duration-700"
          />
          <path
            d={COUNTRIES.israel}
            fill="url(#israelGrad)"
            stroke="white"
            strokeWidth="1.5"
            filter="url(#softShadow)"
          />

          {/* Country labels */}
          <text x="410" y="158" fill="#78716C" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="Rubik">{"\u05D0\u05D9\u05E8\u05D0\u05DF"}</text>
          <text x="188" y="202" fill="white" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="Rubik">IL</text>
          <text x="198" y="168" fill="#78716C" fontSize="5" textAnchor="middle" fontFamily="Rubik">{"\u05DC\u05D1\u05E0\u05D5\u05DF"}</text>
          <text x="248" y="152" fill="#B0B5BF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05E1\u05D5\u05E8\u05D9\u05D4"}</text>
          <text x="328" y="158" fill="#B0B5BF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05E2\u05D9\u05E8\u05D0\u05E7"}</text>
          <text x="200" y="98" fill="#B0B5BF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05D8\u05D5\u05E8\u05E7\u05D9\u05D4"}</text>
          <text x="115" y="268" fill="#B0B5BF" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05DE\u05E6\u05E8\u05D9\u05DD"}</text>
          <text x="225" y="225" fill="#B0B5BF" fontSize="6" textAnchor="middle" fontFamily="Rubik">{"\u05D9\u05E8\u05D3\u05DF"}</text>
          <text x="300" y="305" fill="#C4C8CE" fontSize="7" textAnchor="middle" fontFamily="Rubik">{"\u05E1\u05E2\u05D5\u05D3\u05D9\u05D4"}</text>

          {/* Water labels */}
          <text x="72" y="210" fill="#93C5FD" fontSize="6" fontStyle="italic" textAnchor="middle" fontFamily="Rubik" transform="rotate(-15 72 210)">{"\u05D4\u05D9\u05DD \u05D4\u05EA\u05D9\u05DB\u05D5\u05DF"}</text>

          {/* Trajectory */}
          {isActive && origin && (
            <g>
              {/* Dashed guide line */}
              <path
                d={arcPath}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.25"
              />
              {/* Animated colored trajectory */}
              <path
                d={arcPath}
                fill="none"
                stroke="url(#trajectoryGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset="300"
                className="animate-trajectory"
              />
              {/* Origin marker */}
              <circle cx={fromPoint.x} cy={fromPoint.y} r="16" fill="url(#pulseOrange)" className="animate-pulse" />
              <circle cx={fromPoint.x} cy={fromPoint.y} r="5" fill="#F59E0B" stroke="white" strokeWidth="2" filter="url(#pinShadow)" />
              {/* Target marker */}
              <circle cx={ISRAEL.x} cy={ISRAEL.y} r="16" fill="url(#pulseRed)" className="animate-pulse" />
              <circle cx={ISRAEL.x} cy={ISRAEL.y} r="5" fill="#EF4444" stroke="white" strokeWidth="2" filter="url(#pinShadow)" />

              {/* Rocket emoji along path */}
              <path id="missilePath" d={arcPath} fill="none" stroke="none" />
              <text fontSize="14">
                <textPath href="#missilePath" startOffset="55%">
                  {"\uD83D\uDE80"}
                </textPath>
              </text>
            </g>
          )}

          {/* User location pin */}
          {svgPoint && svgPoint.x > 0 && svgPoint.x < 500 && svgPoint.y > 0 && svgPoint.y < 375 && (
            <g filter="url(#pinShadow)">
              <circle cx={svgPoint.x} cy={svgPoint.y} r="10" fill="url(#pulseBlue)" className="animate-pulse" />
              {/* Pin shape */}
              <g transform={`translate(${svgPoint.x - 6}, ${svgPoint.y - 16})`}>
                <path
                  d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle cx="6" cy="6" r="2.5" fill="white" />
              </g>
              <text
                x={svgPoint.x}
                y={svgPoint.y + 10}
                fill="#3B82F6"
                fontSize="5"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="Rubik"
              >
                {"\u05D0\u05EA\u05D4 \u05E4\u05D4"}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
