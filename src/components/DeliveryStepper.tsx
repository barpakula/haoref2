import { clsx } from "clsx";

const STEPS = [
  { num: 1, label: "איש צוות\nמוכן", icon: "M16 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" },
  { num: 2, label: "משגר\nהוצא", icon: "M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10h20V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm10 12H5v-6h14v6z" },
  { num: 3, label: "חימוש\nטעון", icon: "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" },
  { num: 4, label: "ספירה\nלאחור", icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" },
  { num: 5, label: "אזעקה!", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" },
];

interface Props {
  currentStep: number;
}

export function DeliveryStepper({ currentStep }: Props) {
  return (
    <div className="bg-white px-3 py-4 shadow-card animate-slide-up">
      <div className="flex items-start justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 right-[10%] left-[10%] h-[3px] bg-gray-100 rounded-full" />
        {/* Active line */}
        <div
          className="absolute top-4 right-[10%] h-[3px] bg-wolt-blue rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 80)}%` }}
        />

        {STEPS.map((step) => {
          const isActive = step.num <= currentStep;
          const isCurrent = step.num === currentStep;
          const isPast = step.num < currentStep;

          return (
            <div key={step.num} className="flex flex-col items-center z-10 flex-1">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 relative",
                  isCurrent && step.num === 5 && "bg-wolt-red scale-110 shadow-lg shadow-red-500/30",
                  isCurrent && step.num !== 5 && "bg-wolt-blue scale-110 shadow-lg shadow-wolt-blue/30",
                  isPast && "bg-wolt-blue",
                  !isActive && "bg-gray-200"
                )}
              >
                {isPast ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isActive ? "white" : "#9CA3AF"}>
                    <path d={step.icon} />
                  </svg>
                )}
                {isCurrent && (
                  <div className={clsx(
                    "absolute inset-0 rounded-full border-2 animate-ping opacity-30",
                    step.num === 5 ? "border-wolt-red" : "border-wolt-blue"
                  )} />
                )}
              </div>
              <span
                className={clsx(
                  "text-[10px] mt-1.5 text-center whitespace-pre-line leading-tight font-medium transition-colors",
                  isCurrent && step.num === 5 ? "text-wolt-red font-bold" : isCurrent ? "text-wolt-blue font-bold" : isActive ? "text-wolt-dark" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
