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
