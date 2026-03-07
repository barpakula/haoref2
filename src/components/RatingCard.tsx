import { useState, useEffect } from "react";
import { useHaptics } from "@/hooks/useHaptics";

interface Props {
  launcher: string;
  orderName: string;
}

const TIP_OPTIONS = ["10%", "15%", "20%", "לא שורד"];

export function RatingCard({ launcher, orderName }: Props) {
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const haptics = useHaptics();

  // Auto-dismiss the thank-you card after 3 seconds
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(t);
  }, [submitted]);

  if (hidden) return null;

  if (submitted) {
    return (
      <div className="mx-4 mt-2 animate-slide-up">
        <div className="bg-white rounded-2xl p-5 shadow-card text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-display text-lg text-wolt-dark">
            תודה על הדירוג!
          </p>
          <p className="text-sm text-gray-400 mt-1">
            הדירוג שלך עוזר לנו לשפר את דיוק הפגיעה
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-2 animate-slide-up">
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <p className="text-center text-sm text-gray-400 mb-1">
          המשלוח הסתיים!
        </p>
        <p className="text-center font-display text-lg text-wolt-dark mb-1">
          איך היה המשלוח?
        </p>
        {orderName && (
          <p className="text-center text-xs text-gray-400 mb-3">
            {orderName} • {launcher}
          </p>
        )}

        {/* Star rating */}
        <div className="flex justify-center gap-2 mb-4" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                haptics.tap();
                setRating(star);
              }}
              className="transition-transform active:scale-90"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={star <= rating ? "#FBBF24" : "none"}
                stroke={star <= rating ? "#FBBF24" : "#D1D5DB"}
                strokeWidth="1.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        {/* Tip options */}
        <p className="text-xs text-gray-400 text-center mb-2">
          טיפ לשליח?
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {TIP_OPTIONS.map((tip) => (
            <button
              key={tip}
              onClick={() => {
                haptics.tap();
                setSelectedTip(tip);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTip === tip
                  ? "bg-wolt-blue text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tip}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={() => {
            haptics.success();
            setSubmitted(true);
          }}
          className="w-full bg-wolt-blue text-white py-2.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
        >
          שלח דירוג
        </button>
      </div>
    </div>
  );
}
