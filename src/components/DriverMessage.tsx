import { useState, useEffect } from "react";
import { EventPhase } from "@/lib/types";
import { DRIVER_MESSAGES } from "@/lib/mock-data";

interface Props {
  phase: EventPhase;
  launcher: string;
}

const ACTIVE_PHASES = ["earlyWarning", "missiles", "ended"] as const;
type ActivePhase = (typeof ACTIVE_PHASES)[number];

function isActivePhase(phase: EventPhase): phase is ActivePhase {
  return ACTIVE_PHASES.includes(phase as ActivePhase);
}

export function DriverMessage({ phase, launcher }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle messages every 4 seconds during active phases
  useEffect(() => {
    if (!isActivePhase(phase)) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % DRIVER_MESSAGES[phase].length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

  if (!isActivePhase(phase)) return null;

  const message = DRIVER_MESSAGES[phase][messageIndex % DRIVER_MESSAGES[phase].length];

  return (
    <div className="mx-4 mt-2 animate-slide-up">
      <div className="bg-white rounded-2xl px-4 py-3 shadow-card flex items-start gap-3">
        {/* Driver avatar */}
        <div className="w-9 h-9 rounded-full bg-wolt-blue/10 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#009DE0">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-wolt-dark">{launcher}</span>
            <span className="text-[10px] text-gray-400">עכשיו</span>
          </div>
          <p className="text-sm text-gray-600 leading-snug transition-all duration-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
