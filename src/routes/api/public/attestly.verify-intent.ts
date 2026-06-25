import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const WP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export const Route = createFileRoute("/api/public/attestly/verify-intent")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const apiKey = process.env.ATTESTLY_API_KEY;
        const hub = process.env.ATTESTLY_HUB;
        if (!apiKey || !hub) return json({ paid: false, error: "Attestly not configured" }, 500);

        let body: { paymentIntentId?: string; orderId?: number | string; orderKey?: string } = {};
        try {
          body = await request.json();
        } catch {
          return json({ paid: false, error: "Invalid JSON body" }, 400);
        }
        if (!body.paymentIntentId) return json({ paid: false, error: "paymentIntentId required" }, 400);
        if (!body.orderId || !body.orderKey) return json({ paid: false, error: "orderId and orderKey required" }, 400);

        try {
          const upstream = await fetch(`${hub}/api/connect/verify-intent`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              paymentIntentId: body.paymentIntentId,
              orderId: body.orderId,
              orderKey: body.orderKey,
            }),
          });
          const data = (await upstream.json().catch(() => ({}))) as { paid?: boolean; status?: string; error?: string };
          if (!data.paid) return json({ paid: false, error: data.error ?? "Payment was not completed." });

          const confirm = await fetch(`${WP_BASE}/payment-confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              order_id: Number(body.orderId),
              order_key: body.orderKey,
              transaction: {
                provider: "attestly",
                payment_intent: body.paymentIntentId,
                status: data.status ?? "paid",
              },
            }),
          });
          const confirmData = (await confirm.json().catch(() => ({}))) as { message?: string };
          if (!confirm.ok) {
            return json({ paid: false, error: confirmData.message ?? "Could not mark order paid." }, confirm.status || 502);
          }
          return json({ paid: true });
        } catch (e) {
          return json({ paid: false, error: e instanceof Error ? e.message : "verify failed" }, 500);
        }
      },
    },
  },
});
