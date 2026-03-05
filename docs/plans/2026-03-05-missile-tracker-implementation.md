# Missile Delivery Tracker — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a satirical Wolt-style missile alert tracker powered by real Pikud HaOref data, deployed on Cloudflare Workers for $0.

**Architecture:** Vite + React + Tailwind frontend served as static assets by a Cloudflare Worker running Hono. The worker also proxies requests to the Pikud HaOref API (handling CORS + required headers). Frontend polls the worker every 2 seconds and infers missile origin (Iran vs Lebanon) based on alert type.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Hono, Cloudflare Workers, Wrangler, custom SVG map.

**Design doc:** `docs/plans/2026-03-05-missile-tracker-design.md`

---

### Task 1: Scaffold Vibekit-style project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `tsconfig.worker.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `wrangler.jsonc`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `worker/index.ts`

**Step 1: Create package.json with dependencies**

```json
{
  "name": "haoref2",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "deploy": "wrangler deploy",
    "publish": "npm run build && npm run deploy",
    "preview": "vite preview"
  },
  "dependencies": {
    "hono": "^4.7.10",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.2.3",
    "@cloudflare/workers-types": "^4.20250521.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.2",
    "vite": "npm:rolldown-vite@latest",
    "wrangler": "^4.16.0"
  }
}
```

**Step 2: Create all config files**

`tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": "."
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

`tsconfig.worker.json`:
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "noEmit": true,
    "strict": true
  },
  "include": ["worker"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        oref: {
          orange: "#E8922A",
          blue: "#1B4F72",
          "blue-light": "#5B9BD5",
          dark: "#2C3E50",
        },
      },
    },
  },
  plugins: [],
};
```

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`wrangler.jsonc`:
```jsonc
{
  "name": "haoref2",
  "compatibility_date": "2025-04-01",
  "assets": { "directory": "./dist" }
}
```

**Step 3: Create entry files**

`index.html`:
```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>הטיל בדרך!</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Heebo', sans-serif;
  direction: rtl;
  background: #f5f5f5;
  margin: 0;
}
```

`src/main.tsx`:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/App.tsx`:
```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-oref-blue">הטיל בדרך!</h1>
    </div>
  );
}
```

**Step 4: Create the Hono worker**

`worker/index.ts`:
```ts
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  ASSETS: { fetch: typeof fetch };
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors());

// Proxy to Pikud HaOref alerts API
app.get("/api/alerts", async (c) => {
  const res = await fetch(
    "https://www.oref.org.il/WarningMessages/alert/alerts.json",
    {
      headers: {
        Referer: "https://www.oref.org.il/",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    }
  );
  const text = await res.text();
  return c.text(text, 200, { "Content-Type": "application/json" });
});

// Proxy to alert history
app.get("/api/history", async (c) => {
  const res = await fetch(
    "https://www.oref.org.il/WarningMessages/History/AlertsHistory.json",
    {
      headers: {
        Referer: "https://www.oref.org.il/",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    }
  );
  const text = await res.text();
  return c.text(text, 200, { "Content-Type": "application/json" });
});

// Serve static assets for everything else
app.get("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
```

**Step 5: Install dependencies and verify dev server starts**

```bash
npm install
npm run dev
```

Expected: Vite dev server running, shows "הטיל בדרך!" in browser.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Vite + React + Tailwind + Hono worker"
git push
```

---

### Task 2: Alert types, mock data, and polling hook

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/mock-data.ts`
- Create: `src/hooks/useAlerts.ts`

**Step 1: Define TypeScript types**

`src/lib/types.ts`:
```ts
export interface OrefAlert {
  id: string;
  cat: string;
  title: string;
  data: string[];
  desc: string;
}

export type MissileOrigin = "iran" | "lebanon" | null;

export interface TrackerState {
  isActive: boolean;
  origin: MissileOrigin;
  alerts: OrefAlert[];
  earlyWarningTime: number | null; // timestamp when early warning received
  currentStep: number; // 1-5 for the delivery stepper
  etaSeconds: number | null; // countdown
  affectedCities: string[];
}

// Alert categories from Pikud HaOref
export const ALERT_CATEGORIES: Record<string, string> = {
  "1": "ירי טילים ורקטות",
  "2": "אזעקת בדיקה",
  "3": "רעידת אדמה",
  "4": "סכנה כימית",
  "5": "צונאמי",
  "6": "חדירת כלי טיס",
  "13": "חדירת מחבלים",
  "14": "ידיעה מוקדמת",
};
```

**Step 2: Create mock data for demo mode**

`src/lib/mock-data.ts`:
```ts
import { OrefAlert } from "./types";

export const MOCK_IRAN_EARLY_WARNING: OrefAlert = {
  id: "mock-iran-ew-1",
  cat: "14",
  title: "ידיעה מוקדמת",
  data: [],
  desc: "ידיעה מוקדמת על שיגור טילים מאיראן",
};

export const MOCK_IRAN_MISSILES: OrefAlert = {
  id: "mock-iran-m-1",
  cat: "1",
  title: "ירי טילים ורקטות",
  data: [
    "תל אביב - מרכז העיר",
    "תל אביב - מזרח",
    "רמת גן",
    "גבעתיים",
    "חולון",
    "ירושלים - מרכז",
    "באר שבע - מזרח",
  ],
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות",
};

export const MOCK_LEBANON_MISSILES: OrefAlert = {
  id: "mock-leb-1",
  cat: "1",
  title: "ירי טילים ורקטות",
  data: [
    "קריית שמונה",
    "מטולה",
    "נהריה",
    "עכו",
    "חיפה - כרמל ועיר תחתית",
    "חיפה - מפרץ",
  ],
  desc: "היכנסו למרחב המוגן",
};

// Funny launcher names
export const LAUNCHER_NAMES = [
  "ע. כרמניאן",
  "מ. חמינאי ג׳וניור",
  "חסן מהלוגיסטיקה",
  "עלי מהמשמרת",
  "אבו רקטה",
  "הנהג החדש",
];

export function getRandomLauncher(): string {
  return LAUNCHER_NAMES[Math.floor(Math.random() * LAUNCHER_NAMES.length)];
}
```

**Step 3: Create the alert polling hook with origin inference**

`src/hooks/useAlerts.ts`:
```ts
import { useState, useEffect, useCallback, useRef } from "react";
import { OrefAlert, MissileOrigin, TrackerState } from "@/lib/types";
import {
  MOCK_IRAN_EARLY_WARNING,
  MOCK_IRAN_MISSILES,
  MOCK_LEBANON_MISSILES,
  getRandomLauncher,
} from "@/lib/mock-data";

const IRAN_ETA_SECONDS = 7 * 60; // ~7 minutes
const POLL_INTERVAL = 2000;

function inferOrigin(
  alert: OrefAlert,
  hadEarlyWarning: boolean
): MissileOrigin {
  if (alert.cat === "14") return "iran";
  if (alert.cat === "1" && hadEarlyWarning) return "iran";
  if (alert.cat === "1") return "lebanon";
  return null;
}

function getStepForState(
  origin: MissileOrigin,
  earlyWarningTime: number | null,
  hasMissileAlert: boolean
): number {
  if (!origin) return 0;
  if (origin === "iran") {
    if (!earlyWarningTime) return 1;
    const elapsed = (Date.now() - earlyWarningTime) / 1000;
    if (elapsed < 60) return 2;
    if (elapsed < 180) return 3;
    if (elapsed < 300) return 4;
    return 5;
  }
  // Lebanon — immediate
  return hasMissileAlert ? 5 : 0;
}

export function useAlerts(demoMode: boolean) {
  const [state, setState] = useState<TrackerState>({
    isActive: false,
    origin: null,
    alerts: [],
    earlyWarningTime: null,
    currentStep: 0,
    etaSeconds: null,
    affectedCities: [],
  });
  const [launcher, setLauncher] = useState(getRandomLauncher());
  const earlyWarningRef = useRef<number | null>(null);

  const processAlerts = useCallback((alerts: OrefAlert[]) => {
    if (!alerts || alerts.length === 0) {
      // Clear state after a delay (alerts are ephemeral)
      return;
    }

    const hadEarlyWarning = earlyWarningRef.current !== null;

    for (const alert of alerts) {
      const origin = inferOrigin(alert, hadEarlyWarning);

      if (alert.cat === "14" && !earlyWarningRef.current) {
        earlyWarningRef.current = Date.now();
        setLauncher(getRandomLauncher());
      }

      if (origin) {
        const hasMissileAlert = alert.cat === "1";
        const step = getStepForState(
          origin,
          earlyWarningRef.current,
          hasMissileAlert
        );
        const cities = alerts.flatMap((a) => a.data).filter(Boolean);

        let etaSeconds: number | null = null;
        if (origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }

        setState({
          isActive: true,
          origin,
          alerts,
          earlyWarningTime: earlyWarningRef.current,
          currentStep: step,
          etaSeconds,
          affectedCities: cities,
        });
        return;
      }
    }
  }, []);

  // Poll real API
  useEffect(() => {
    if (demoMode) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/alerts");
        const text = await res.text();
        if (text && text.trim()) {
          const data = JSON.parse(text);
          const alerts = Array.isArray(data) ? data : data ? [data] : [];
          processAlerts(alerts);
        } else {
          // No active alerts — keep state for a bit then clear
          if (state.isActive) {
            setState((s) => ({ ...s, isActive: false, currentStep: 0 }));
            earlyWarningRef.current = null;
          }
        }
      } catch {
        // Silently fail on poll errors
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [demoMode, processAlerts, state.isActive]);

  // Demo mode: cycle through scenarios
  useEffect(() => {
    if (!demoMode) return;

    // Simulate Iran scenario: early warning -> wait -> missiles
    const timeline = [
      { delay: 0, alert: MOCK_IRAN_EARLY_WARNING },
      { delay: 8000, alert: MOCK_IRAN_MISSILES },
    ];

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timeline.forEach(({ delay, alert }) => {
      timeouts.push(
        setTimeout(() => processAlerts([alert]), delay)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [demoMode, processAlerts]);

  // Update step and ETA every second during active alert
  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      setState((s) => {
        const step = getStepForState(
          s.origin,
          earlyWarningRef.current,
          s.alerts.some((a) => a.cat === "1")
        );
        let etaSeconds = s.etaSeconds;
        if (s.origin === "iran" && earlyWarningRef.current) {
          const elapsed = (Date.now() - earlyWarningRef.current) / 1000;
          etaSeconds = Math.max(0, IRAN_ETA_SECONDS - elapsed);
        }
        return { ...s, currentStep: step, etaSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive]);

  const clearAlerts = useCallback(() => {
    setState({
      isActive: false,
      origin: null,
      alerts: [],
      earlyWarningTime: null,
      currentStep: 0,
      etaSeconds: null,
      affectedCities: [],
    });
    earlyWarningRef.current = null;
  }, []);

  const triggerDemo = useCallback((scenario: "iran" | "lebanon") => {
    earlyWarningRef.current = null;
    setLauncher(getRandomLauncher());
    if (scenario === "iran") {
      processAlerts([MOCK_IRAN_EARLY_WARNING]);
      setTimeout(() => processAlerts([MOCK_IRAN_MISSILES]), 8000);
    } else {
      processAlerts([MOCK_LEBANON_MISSILES]);
    }
  }, [processAlerts]);

  return { state, launcher, clearAlerts, triggerDemo };
}
```

**Step 4: Commit**

```bash
git add src/lib/ src/hooks/
git commit -m "feat: add alert types, mock data, and polling hook with origin inference"
git push
```

---

### Task 3: Delivery stepper component

**Files:**
- Create: `src/components/DeliveryStepper.tsx`

**Step 1: Build the Wolt-style RTL stepper**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/components/
git commit -m "feat: add Wolt-style delivery stepper component"
git push
```

---

### Task 4: SVG Middle East map with trajectory arcs

**Files:**
- Create: `src/components/MissileMap.tsx`

**Step 1: Build SVG map component with animated trajectory**

This is a simplified SVG map of the Middle East region showing Israel, Iran, Lebanon, and surrounding countries. The trajectory arc animates from origin to Israel.

```tsx
import { MissileOrigin } from "@/lib/types";
import { clsx } from "clsx";

interface Props {
  origin: MissileOrigin;
  isActive: boolean;
}

// Simplified SVG coordinates for key points
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

        {/* Water bodies */}
        <ellipse cx="120" cy="200" rx="80" ry="120" fill="white" opacity="0.7" />
        <path d="M 140 280 L 155 375 L 175 375 L 160 280 Z" fill="white" opacity="0.7" />

        {/* Turkey */}
        <path d="M 100 80 L 300 60 L 320 100 L 280 120 L 200 130 L 100 120 Z" fill="#6B7280" />

        {/* Syria */}
        <path d="M 200 130 L 280 120 L 290 170 L 230 180 L 200 160 Z" fill="#6B7280" />

        {/* Iraq */}
        <path d="M 280 120 L 350 110 L 370 180 L 310 200 L 290 170 Z" fill="#6B7280" />

        {/* Iran - highlighted orange */}
        <path
          d="M 350 110 L 450 80 L 480 150 L 460 220 L 400 240 L 370 180 Z"
          fill={origin === "iran" ? "#E8922A" : "#9CA3AF"}
          className="transition-colors duration-500"
        />

        {/* Lebanon - small */}
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

        {/* Red Sea */}
        <path d="M 160 300 L 200 375 L 180 375 L 140 310 Z" fill="white" opacity="0.5" />

        {/* Country labels */}
        <text x="400" y="160" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">איראן</text>
        <text x="186" y="200" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">IL</text>
        <text x="196" y="170" fill="white" fontSize="6" textAnchor="middle">לב׳</text>

        {/* Trajectory arc */}
        {isActive && origin && (
          <g>
            {/* Arc path background */}
            <path
              d={arcPath}
              fill="none"
              stroke="#1B4F72"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity="0.4"
            />
            {/* Animated arc */}
            <path
              d={arcPath}
              fill="none"
              stroke="#E8922A"
              strokeWidth="3"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-trajectory"
            />
            {/* Origin marker */}
            <circle
              cx={fromPoint.x}
              cy={fromPoint.y}
              r="5"
              fill="#E8922A"
              className="animate-pulse"
            />
            {/* Target marker */}
            <circle
              cx={ISRAEL.x}
              cy={ISRAEL.y}
              r="5"
              fill="#DC2626"
              className="animate-pulse"
            />
            {/* Missile emoji along path */}
            <text className="animate-missile" fontSize="16">
              <textPath href="#missilePath" startOffset="70%">
                🚀
              </textPath>
            </text>
            <path id="missilePath" d={arcPath} fill="none" stroke="none" />
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
        @keyframes moveMissile {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
      `}</style>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/MissileMap.tsx
git commit -m "feat: add SVG Middle East map with animated trajectory arcs"
git push
```

---

### Task 5: Alert info card component

**Files:**
- Create: `src/components/AlertCard.tsx`

**Step 1: Build the info card with ETA and origin**

```tsx
import { MissileOrigin } from "@/lib/types";

interface Props {
  isActive: boolean;
  origin: MissileOrigin;
  etaSeconds: number | null;
  launcher: string;
  affectedCities: string[];
}

function formatEta(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const ORIGIN_LABELS: Record<string, string> = {
  iran: "איראן",
  lebanon: "לבנון",
};

export function AlertCard({
  isActive,
  origin,
  etaSeconds,
  launcher,
  affectedCities,
}: Props) {
  if (!isActive) {
    return (
      <div className="bg-oref-blue text-white px-4 py-6 text-center">
        <p className="text-xl font-bold">אין התראות פעילות</p>
        <p className="text-sm opacity-70 mt-1">המשגר בהפסקת צהריים 🥙</p>
      </div>
    );
  }

  return (
    <div className="bg-oref-blue text-white px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🚀</span>
        <h2 className="text-xl font-bold">הטיל בדרך!</h2>
      </div>
      {etaSeconds !== null && (
        <p className="text-lg font-bold">
          זמן הגעה משוער: {formatEta(etaSeconds)}
        </p>
      )}
      {origin && (
        <p className="text-sm opacity-90">מקור: {ORIGIN_LABELS[origin]}</p>
      )}
      <p className="text-sm opacity-70">המשגר: {launcher}</p>
      {affectedCities.length > 0 && (
        <div className="mt-2 text-sm">
          <p className="font-bold">אזורים מאוימים:</p>
          <p className="opacity-90">{affectedCities.slice(0, 5).join(", ")}</p>
          {affectedCities.length > 5 && (
            <p className="opacity-70">ועוד {affectedCities.length - 5} אזורים...</p>
          )}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/AlertCard.tsx
git commit -m "feat: add alert info card with ETA countdown and launcher name"
git push
```

---

### Task 6: Bottom navigation and tab layout

**Files:**
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/Header.tsx`

**Step 1: Build header**

```tsx
export function Header() {
  return (
    <div className="bg-oref-orange text-white px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">מעקב שיגור טילים</h1>
      <div className="w-10 h-10 bg-oref-blue rounded-lg flex items-center justify-center">
        <span className="text-lg">🏠</span>
      </div>
    </div>
  );
}
```

**Step 2: Build bottom nav**

```tsx
import { clsx } from "clsx";

export type TabId = "map" | "alerts" | "history" | "settings";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "map", label: "מפה", icon: "🗺️" },
  { id: "alerts", label: "התראות", icon: "🔔" },
  { id: "history", label: "היסטוריה", icon: "🕐" },
  { id: "settings", label: "הגדרות", icon: "⚙️" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 safe-bottom">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
            active === tab.id
              ? "text-oref-blue"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/Header.tsx src/components/BottomNav.tsx
git commit -m "feat: add header and bottom navigation components"
git push
```

---

### Task 7: Tab views — Alerts, History, Settings

**Files:**
- Create: `src/components/AlertsTab.tsx`
- Create: `src/components/HistoryTab.tsx`
- Create: `src/components/SettingsTab.tsx`

**Step 1: Alerts tab — live feed**

```tsx
import { OrefAlert } from "@/lib/types";

interface Props {
  alerts: OrefAlert[];
}

export function AlertsTab({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-lg">אין התראות פעילות</p>
        <p className="text-sm mt-1">נודיע לך כשיהיה משהו מעניין 💤</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-bold">{alert.title}</span>
          </div>
          <p className="text-sm text-gray-600">{alert.desc}</p>
          {alert.data.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {alert.data.map((city) => (
                <span
                  key={city}
                  className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full"
                >
                  {city}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 2: History tab**

```tsx
import { useState, useEffect } from "react";
import { OrefAlert } from "@/lib/types";

export function HistoryTab() {
  const [history, setHistory] = useState<OrefAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.text())
      .then((text) => {
        if (text && text.trim()) {
          const data = JSON.parse(text);
          setHistory(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">טוען היסטוריה...</div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>אין היסטוריית התראות</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {history.slice(0, 50).map((alert, i) => (
        <div
          key={`${alert.id}-${i}`}
          className="bg-white rounded-lg p-3 shadow-sm text-sm border border-gray-100"
        >
          <div className="font-bold text-oref-blue">{alert.title}</div>
          {alert.data.length > 0 && (
            <div className="text-gray-600 mt-1">
              {alert.data.slice(0, 3).join(", ")}
              {alert.data.length > 3 && ` ועוד ${alert.data.length - 3}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Settings tab with demo controls**

```tsx
interface Props {
  demoMode: boolean;
  onToggleDemo: () => void;
  onTriggerDemo: (scenario: "iran" | "lebanon") => void;
  onClear: () => void;
}

export function SettingsTab({
  demoMode,
  onToggleDemo,
  onTriggerDemo,
  onClear,
}: Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-oref-blue">הגדרות</h2>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">מצב דמו</span>
          <button
            onClick={onToggleDemo}
            className={`w-12 h-6 rounded-full transition-colors ${
              demoMode ? "bg-oref-orange" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                demoMode ? "-translate-x-6" : "-translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-medium">הפעל תרחיש</h3>
          <button
            onClick={() => onTriggerDemo("iran")}
            className="w-full bg-oref-orange text-white py-2 rounded-lg font-bold"
          >
            תרחיש איראן (התראה מוקדמת + טילים)
          </button>
          <button
            onClick={() => onTriggerDemo("lebanon")}
            className="w-full bg-oref-blue text-white py-2 rounded-lg font-bold"
          >
            תרחיש לבנון (טילים ישירים)
          </button>
          <button
            onClick={onClear}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold"
          >
            נקה התראות
          </button>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 mt-8">
        <p>הטיל בדרך! v1.0</p>
        <p>פרויקט סאטירי. לא קשור לפיקוד העורף.</p>
        <p>Stay safe. 🇮🇱</p>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/AlertsTab.tsx src/components/HistoryTab.tsx src/components/SettingsTab.tsx
git commit -m "feat: add alerts, history, and settings tab views"
git push
```

---

### Task 8: Wire everything together in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Assemble all components into the main app**

```tsx
import { useState } from "react";
import { Header } from "@/components/Header";
import { DeliveryStepper } from "@/components/DeliveryStepper";
import { AlertCard } from "@/components/AlertCard";
import { MissileMap } from "@/components/MissileMap";
import { BottomNav, TabId } from "@/components/BottomNav";
import { AlertsTab } from "@/components/AlertsTab";
import { HistoryTab } from "@/components/HistoryTab";
import { SettingsTab } from "@/components/SettingsTab";
import { useAlerts } from "@/hooks/useAlerts";

export default function App() {
  const [tab, setTab] = useState<TabId>("map");
  const [demoMode, setDemoMode] = useState(
    () => new URLSearchParams(window.location.search).has("demo")
  );
  const { state, launcher, clearAlerts, triggerDemo } = useAlerts(demoMode);

  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto relative">
      <Header />

      {tab === "map" && (
        <>
          <DeliveryStepper currentStep={state.currentStep} />
          <AlertCard
            isActive={state.isActive}
            origin={state.origin}
            etaSeconds={state.etaSeconds}
            launcher={launcher}
            affectedCities={state.affectedCities}
          />
          <MissileMap origin={state.origin} isActive={state.isActive} />
        </>
      )}

      {tab === "alerts" && <AlertsTab alerts={state.alerts} />}
      {tab === "history" && <HistoryTab />}
      {tab === "settings" && (
        <SettingsTab
          demoMode={demoMode}
          onToggleDemo={() => setDemoMode((d) => !d)}
          onTriggerDemo={triggerDemo}
          onClear={clearAlerts}
        />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
```

**Step 2: Verify it runs**

```bash
npm run dev
```

Open browser, verify main layout renders with all tabs working.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire all components into main app layout"
git push
```

---

### Task 9: Polish — animations, mobile viewport, final styling

**Files:**
- Modify: `src/index.css` — add animations and mobile styles
- Modify: `index.html` — add meta tags for mobile
- Modify: various components for polish

**Step 1: Add CSS animations and mobile tweaks**

Add to `src/index.css`:
```css
/* Safe area for iPhone bottom bar */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Missile trajectory animation */
@keyframes drawArc {
  to { stroke-dashoffset: 0; }
}

/* Pulse for alert state */
@keyframes alertPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.alert-pulse {
  animation: alertPulse 1.5s ease-in-out infinite;
}
```

Add to `index.html` head:
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#E8922A" />
```

**Step 2: Verify on mobile viewport (Chrome DevTools responsive mode)**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: polish animations, mobile viewport, and final styling"
git push
```

---

### Task 10: Build and verify deployment readiness

**Step 1: Build**

```bash
npm run build
```

Expected: Successful build with dist/ output.

**Step 2: Preview locally**

```bash
npm run preview
```

Verify the built version works.

**Step 3: Final commit and tag**

```bash
git add -A
git commit -m "chore: verify production build"
git push
```

---

## Execution Notes

- No tests in this plan — this is a satirical UI project, not production software
- The SVG map is intentionally simplified/stylized to match the mockup aesthetic
- Cloudflare deployment can be done later with `npm run deploy` after `wrangler login`
- The worker proxies API calls to handle CORS; the actual oref.org.il API is geo-blocked so this only works from Israeli IPs
