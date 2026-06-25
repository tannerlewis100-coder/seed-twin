import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const WOO_STORE = "https://admin.clarumpeptides.com/wp-json/wc/store/v1";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export const Route = createFileRoute("/api/public/attestly/create-intent")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const apiKey = process.env.ATTESTLY_API_KEY;
        const hub = process.env.ATTESTLY_HUB;
        if (!apiKey || !hub) return json({ error: "Attestly not configured" }, 500);

        let body: { orderId?: number | string; orderKey?: string } = {};
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }
        const orderId = body.orderId;
        const orderKey = body.orderKey;
        if (!orderId || !orderKey) return json({ error: "orderId and orderKey required" }, 400);

        // Read order total server-side from WooCommerce (never trust the browser).
        let amountCents = 0;
        let currency = "usd";
        try {
          const orderRes = await fetch(
            `${WOO_STORE}/order/${encodeURIComponent(String(orderId))}?key=${encodeURIComponent(String(orderKey))}`,
            { headers: { Accept: "application/json" } },
          );
          if (!orderRes.ok) {
            const text = await orderRes.text();
            return json({ error: "Could not load order", detail: text.slice(0, 200) }, 400);
          }
          const order = (await orderRes.json()) as {
            totals?: { total_price?: string; currency_minor_unit?: number; currency_code?: string };
          };
          const totalRaw = order.totals?.total_price ?? "0";
          const minor = order.totals?.currency_minor_unit ?? 2;
          // total_price is already in minor units as a string in Store API.
          amountCents = Math.round(Number(totalRaw));
          // Normalize if backend ever returns a decimal string.
          if (!Number.isFinite(amountCents) || amountCents <= 0) {
            amountCents = Math.round(Number(totalRaw) * Math.pow(10, 2 - minor));
          }
          currency = (order.totals?.currency_code ?? "USD").toLowerCase();
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "order fetch failed" }, 500);
        }

        if (!amountCents || amountCents < 50) {
          return json({ error: "Order total too small for card payment" }, 400);
        }

        try {
          const upstream = await fetch(`${hub}/api/connect/create-intent`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              amountCents,
              currency,
              idempotencyKey: String(orderId),
              metadata: { wcOrderId: String(orderId) },
            }),
          });
          const data = (await upstream.json().catch(() => ({}))) as { clientSecret?: string; error?: string };
          if (!upstream.ok || !data.clientSecret) {
            return json({ error: data.error ?? "Attestly create-intent failed" }, upstream.status || 502);
          }
          return json({ clientSecret: data.clientSecret, amountCents });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "create-intent failed" }, 500);
        }
      },
    },
  },
});
