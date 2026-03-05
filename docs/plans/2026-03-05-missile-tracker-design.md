# "הטיל בדרך!" — Missile Delivery Tracker

## Concept

A satirical Wolt/10bis-style "delivery tracking" app for missile alerts, powered by real Pikud HaOref data. The joke that actually works.

## Architecture

```
+---------------------+     +----------------------+
|   React SPA         |     |  Cloudflare Worker   |
|   (Vite + Tailwind) |---->|  (Hono proxy)        |
|                     |     |                      |
|  - Delivery UI      |     |  GET /api/alerts     |
|  - SVG Map          |     |    -> polls oref     |
|  - Alert History    |     |  GET /api/history    |
|  - RTL Hebrew       |     |    -> history endpt  |
+---------------------+     +----------------------+
        |                            |
        |  Hosted on CF Pages        |  CF Worker (same deploy)
        |  (free)                    |  (free tier: 100k req/day)
        +----------------------------+
```

## Data Source

Pikud HaOref public API:
- Active alerts: `https://www.oref.org.il/WarningMessages/alert/alerts.json`
- Alert history: `https://www.oref.org.il/WarningMessages/History/AlertsHistory.json`
- Polls every 2 seconds
- Required headers: `Referer: https://www.oref.org.il/`, `X-Requested-With: XMLHttpRequest`
- Geo-blocked to Israeli IPs

### Alert Response Format

```json
{
  "id": "134168709720000000",
  "cat": "1",
  "title": "ירי טילים ורקטות",
  "data": ["תל אביב - מזרח", "חיפה"],
  "desc": "היכנסו למרחב המוגן"
}
```

### Category Codes
- 1: Rocket/missile fire
- 2: Building damage warning
- 3: Earthquake
- 4: Chemical hazard
- 5: Tsunami
- 6: Unauthorized aircraft
- 13: Infiltration threat
- 14: News flash / early warning

## Origin Inference Logic

```
if alert.cat == 14 (newsFlash/early warning):
  -> origin = IRAN
  -> start 6-7 min countdown until sirens
  -> show Iran->Israel arc on map

if alert.cat == 1 (missiles) AND no preceding early warning:
  -> origin = LEBANON
  -> show Lebanon->Israel arc on map
  -> immediate shelter countdown (15-90s based on region)
```

## UI Screens (4 tabs)

### 1. מפה (Map) — Main Screen
- Orange header: "מעקב שיגור טילים" with Pikud HaOref-style logo
- Wolt stepper (RTL):
  1. איש צוות מוכן (Crew ready)
  2. משגר הוצא (Launcher deployed)
  3. חימוש טעון (Ammo loaded)
  4. ספירה לאחור (Countdown)
  5. הטיל בדרך! (Missile on the way!)
- Info card: ETA countdown, origin label, humorous "launcher name"
- SVG map: Stylized Middle East, orange countries, animated arc trajectory

### 2. התראות (Alerts)
- Live alert feed with cards: time, affected cities, category, inferred origin
- Browser push notifications via Web Notifications API

### 3. היסטוריה (History)
- Past alerts from history endpoint
- Filterable by date, origin

### 4. הגדרות (Settings)
- Demo mode toggle
- Region selection (for time-to-shelter)
- Notification preferences

## Idle State
- Stepper grayed out
- Map without trajectory
- Funny text: "המשגר בהפסקת צהריים" (The launcher is on lunch break)

## Demo Mode
- `?demo=true` URL param or toggle in settings
- Cycles through mock alerts (Iran early warning -> missile, Lebanon direct)
- History tab uses real history endpoint data

## Tech Stack (Vibekit-derived, stripped down)

| Layer | Tech | Cost |
|-------|------|------|
| Frontend | React 18 + TypeScript + Vite | $0 |
| Styling | Tailwind CSS + custom RTL | $0 |
| UI | Radix UI (minimal) | $0 |
| Map | Custom SVG + CSS animations | $0 |
| Backend | Hono on Cloudflare Workers | $0 |
| Hosting | Cloudflare Pages | $0 |
| API | Pikud HaOref public endpoints | $0 |

## NOT Building
- No auth/login
- No database (stateless)
- No file storage
- No AI features
- No push notification server (browser-native only)
