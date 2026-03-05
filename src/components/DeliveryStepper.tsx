import { clsx } from "clsx";

const STEPS = [
  { num: 1, label: "איש צוות\nמוכן" },
  { num: 2, label: "משגר\nהוצא" },
  { num: 3, label: "חימוש\nטעון" },
  { num: 4, label: "ספירה\nלאחור" },
  { num: 5, label: "הטיל בדרך!" },
];

interface Props {
  currentStep: number;
}

export function DeliveryStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-oref-blue-light/30">
      {STEPS.map((step, i) => {
        const isActive = step.num <= currentStep;
        const isCurrent = step.num === currentStep;
        return (
          <div key={step.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center text-center flex-1">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  isCurrent && step.num === 5
                    ? "bg-oref-orange text-white scale-110"
                    : isActive
                    ? "bg-oref-blue text-white"
                    : "bg-gray-300 text-gray-500"
                )}
              >
                {isActive && step.num === 5 ? "✓" : step.num}
              </div>
              <span
                className={clsx(
                  "text-xs mt-1 whitespace-pre-line leading-tight",
                  isActive ? "text-oref-blue font-bold" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  "h-0.5 flex-1 mx-1 transition-all",
                  step.num < currentStep ? "bg-oref-blue" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
