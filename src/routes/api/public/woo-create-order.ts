import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const WC_BASE = "https://admin.clarumpeptides.com/wp-json/wc/v3";

type Addr = {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
};

type Body = {
  email: string;
  billing: Addr;
  shipping: Addr;
  payment_method: string;
  payment_method_title?: string;
  customer_note?: string;
  items: Array<{ id: number; quantity: number }>;
  coupons?: string[];
  shipping_line?: { method_title: string; total: string } | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function authHeader() {
  const k = process.env.WC_CONSUMER_KEY;
  const s = process.env.WC_CONSUMER_SECRET;
  if (!k || !s) return null;
  return "Basic " + Buffer.from(`${k}:${s}`).toString("base64");
}

export const Route = createFileRoute("/api/public/woo-create-order")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const auth = authHeader();
        if (!auth) return json({ error: "WooCommerce REST credentials not configured" }, 500);

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        if (!Array.isArray(body.items) || body.items.length === 0) {
          return json({ error: "No items" }, 400);
        }

        // Resolve each cart item id → { product_id, variation_id? }
        const lineItems: Array<{ product_id: number; variation_id?: number; quantity: number }> = [];
        for (const it of body.items) {
          if (!it?.id || !it?.quantity) continue;
          try {
            const r = await fetch(`${WC_BASE}/products/${it.id}`, {
              headers: { Authorization: auth, Accept: "application/json" },
            });
            if (!r.ok) {
              const text = await r.text();
              return json({ error: `Product lookup failed (${r.status})`, detail: text.slice(0, 200) }, 502);
            }
            const p = (await r.json()) as { id: number; parent_id?: number; type?: string };
            if (p.parent_id && p.parent_id > 0) {
              lineItems.push({ product_id: p.parent_id, variation_id: p.id, quantity: it.quantity });
            } else {
              lineItems.push({ product_id: p.id, quantity: it.quantity });
            }
          } catch (e) {
            return json({ error: e instanceof Error ? e.message : "product lookup failed" }, 500);
          }
        }

        const billing = { ...body.billing, email: body.email };
        const shipping = { ...body.shipping };
        // Strip email from shipping (WC v3 shipping doesn't accept email).
        delete (shipping as Addr).email;

        const orderPayload: Record<string, unknown> = {
          status: "pending",
          payment_method: body.payment_method,
          payment_method_title: body.payment_method_title ?? body.payment_method,
          set_paid: false,
          billing,
          shipping,
          line_items: lineItems,
          customer_note: body.customer_note ?? "",
        };

        if (body.coupons && body.coupons.length) {
          orderPayload.coupon_lines = body.coupons.map((code) => ({ code }));
        }
        if (body.shipping_line && body.shipping_line.method_title) {
          orderPayload.shipping_lines = [
            {
              method_id: "flat_rate",
              method_title: body.shipping_line.method_title,
              total: body.shipping_line.total ?? "0",
            },
          ];
        }

        try {
          const r = await fetch(`${WC_BASE}/orders`, {
            method: "POST",
            headers: {
              Authorization: auth,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(orderPayload),
          });
          const text = await r.text();
          let data: Record<string, unknown>;
          try {
            data = JSON.parse(text);
          } catch {
            return json({ error: `Order create failed (${r.status})`, detail: text.slice(0, 300) }, 502);
          }
          if (!r.ok) {
            const msg = (data?.message as string) || `Order create failed (${r.status})`;
            return json({ error: msg, detail: data }, r.status);
          }
          return json({
            id: data.id,
            order_key: data.order_key,
            total: data.total,
            currency: data.currency,
          });
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "order create failed" }, 500);
        }
      },
    },
  },
});
