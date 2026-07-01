import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const WC_BASE = "https://admin.clarumpeptides.com/wp-json/wc/v3";

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
        const ck = process.env.WC_CONSUMER_KEY;
        const cs = process.env.WC_CONSUMER_SECRET;
        if (!apiKey || !hub) return json({ error: "Attestly not configured" }, 500);
        if (!ck || !cs) return json({ error: "WooCommerce credentials not configured" }, 500);

        let body: { orderId?: number | string; otpToken?: string } = {};
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }
        const orderId = body.orderId;
        const otpToken = typeof body.otpToken === "string" ? body.otpToken : undefined;
        if (!orderId) return json({ error: "orderId required" }, 400);

        // Read-only GET of the existing order via WC v3 REST.
        let total = 0;
        let currency = "usd";
        try {
          const basic = Buffer.from(`${ck}:${cs}`).toString("base64");
          const orderRes = await fetch(
            `${WC_BASE}/orders/${encodeURIComponent(String(orderId))}`,
            {
              method: "GET",
              headers: {
                Authorization: `Basic ${basic}`,
                Accept: "application/json",
              },
            },
          );
          if (!orderRes.ok) {
            const text = await orderRes.text();
            return json({ error: "Could not load order", detail: text.slice(0, 300) }, 400);
          }
          const order = (await orderRes.json()) as { total?: string; currency?: string };
          total = Number(order.total ?? "0");
          currency = (order.currency ?? "USD").toLowerCase();
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "order fetch failed" }, 500);
        }

        const amountCents = Math.round(total * 100);
        if (!Number.isFinite(amountCents) || amountCents < 50) {
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
              ...(otpToken ? { otpToken } : {}),
            }),
          });
          const data = (await upstream.json().catch(() => ({}))) as {
            clientSecret?: string;
            error?: string;
          };
          if (!upstream.ok || !data.clientSecret) {
            return json(
              { error: data.error ?? "Attestly create-intent failed" },
              upstream.status || 502,
            );
          }
          const piId = data.clientSecret.split("_secret")[0];
          if (piId) {
            try {
              const basic = Buffer.from(`${ck}:${cs}`).toString("base64");
              await fetch(
                `${WC_BASE}/orders/${encodeURIComponent(String(orderId))}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Basic ${basic}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify({
                    meta_data: [
                      { key: "_attestly_pay_intent_id", value: piId },
                    ],
                  }),
                },
              );
            } catch {
              // non-fatal: intent id metadata write failed
            }
          }
          return json({ clientSecret: data.clientSecret, amountCents, paymentIntentId: piId });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "create-intent failed" }, 500);
        }
      },
    },
  },
});
