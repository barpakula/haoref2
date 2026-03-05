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
    <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
      <svg viewBox="0 0 500 375" className="w-full h-full">
        {/* Background */}
        <rect width="500" height="375" fill="#E8E8E8" />

        {/* Mediterranean Sea */}
        <ellipse cx="120" cy="200" rx="80" ry="120" fill="white" opacity="0.7" />
        {/* Red Sea / Gulf */}
        <path d="M 140 280 L 155 375 L 175 375 L 160 280 Z" fill="white" opacity="0.7" />
        {/* Persian Gulf */}
        <path d="M 380 200 L 420 230 L 400 260 L 370 240 Z" fill="white" opacity="0.5" />

        {/* Turkey */}
        <path d="M 100 80 L 300 60 L 320 100 L 280 120 L 200 130 L 100 120 Z" fill="#6B7280" />
        {/* Syria */}
        <path d="M 200 130 L 280 120 L 290 170 L 230 180 L 200 160 Z" fill="#6B7280" />
        {/* Iraq */}
        <path d="M 280 120 L 350 110 L 370 180 L 310 200 L 290 170 Z" fill="#6B7280" />
        {/* Iran */}
        <path
          d="M 350 110 L 450 80 L 480 150 L 460 220 L 400 240 L 370 180 Z"
          fill={origin === "iran" ? "#E8922A" : "#9CA3AF"}
          className="transition-colors duration-500"
        />
        {/* Lebanon */}
        <path
          d="M 192 165 L 200 160 L 202 178 L 194 180 Z"
          fill={origin === "lebanon" ? "#E8922A" : "#6B7280"}
          className="transition-colors duration-500"
        />
        {/* Israel */}
        <path
          d="M 182 180 L 194 180 L 196 210 L 190 230 L 182 210 Z"
          fill="#2563EB"
          stroke="white"
          strokeWidth="1"
        />
        {/* Jordan */}
        <path d="M 200 180 L 230 180 L 250 230 L 210 260 L 196 210 Z" fill="#6B7280" />
        {/* Saudi Arabia */}
        <path d="M 210 260 L 350 240 L 380 320 L 200 375 L 160 300 Z" fill="#E8922A" />
        {/* Egypt */}
        <path d="M 100 200 L 160 190 L 182 210 L 160 300 L 100 340 L 80 280 Z" fill="#6B7280" />
        {/* Red Sea water */}
        <path d="M 160 300 L 200 375 L 180 375 L 140 310 Z" fill="white" opacity="0.5" />

        {/* Country labels */}
        <text x="400" y="160" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">איראן</text>
        <text x="186" y="200" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">IL</text>
        <text x="196" y="170" fill="white" fontSize="6" textAnchor="middle">לב׳</text>
        <text x="240" y="155" fill="white" fontSize="8" textAnchor="middle">סוריה</text>
        <text x="310" y="155" fill="white" fontSize="8" textAnchor="middle">עיראק</text>
        <text x="200" y="100" fill="white" fontSize="8" textAnchor="middle">טורקיה</text>
        <text x="130" y="270" fill="white" fontSize="8" textAnchor="middle">מצרים</text>

        {/* Trajectory arc */}
        {isActive && origin && (
          <g>
            <path
              d={arcPath}
              fill="none"
              stroke="#1B4F72"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity="0.4"
            />
            <path
              d={arcPath}
              fill="none"
              stroke="#E8922A"
              strokeWidth="3"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-trajectory"
            />
            <circle
              cx={fromPoint.x}
              cy={fromPoint.y}
              r="5"
              fill="#E8922A"
              className="animate-pulse"
            />
            <circle
              cx={ISRAEL.x}
              cy={ISRAEL.y}
              r="5"
              fill="#DC2626"
              className="animate-pulse"
            />
            <path id="missilePath" d={arcPath} fill="none" stroke="none" />
            <text fontSize="16">
              <textPath href="#missilePath" startOffset="60%">
                🚀
              </textPath>
            </text>
          </g>
        )}
      </svg>

      <style>{`
        @keyframes drawTrajectory {
          to { stroke-dashoffset: 0; }
        }
        .animate-trajectory {
          animation: drawTrajectory 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
