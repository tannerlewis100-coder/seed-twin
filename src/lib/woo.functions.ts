import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ItemSchema = z.object({
  sku: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(99),
});

const InputSchema = z.object({
  items: z.array(ItemSchema).min(1).max(50),
});

export type CheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const storeUrl = process.env.WOO_STORE_URL?.replace(/\/$/, "");
    if (!storeUrl) {
      return {
        ok: false,
        error:
          "Store not configured yet. Add WOO_STORE_URL in Lovable secrets to enable checkout.",
      };
    }

    try {
      let cartToken: string | null = null;
      // Add each item, threading the Cart-Token header so Woo keeps one server-side cart.
      for (const item of data.items) {
        const res = await fetch(`${storeUrl}/wp-json/wc/store/v1/cart/add-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(cartToken ? { "Cart-Token": cartToken } : {}),
          },
          body: JSON.stringify({ id: 0, sku: item.sku, quantity: item.quantity }),
        });
        const next = res.headers.get("Cart-Token");
        if (next) cartToken = next;
        if (!res.ok) {
          const text = await res.text();
          console.error(`Woo add-item failed [${res.status}]:`, text);
          return {
            ok: false,
            error: `Could not add ${item.sku} to cart. The store may not have a matching SKU.`,
          };
        }
      }

      const checkoutUrl = cartToken
        ? `${storeUrl}/checkout/?cart-token=${encodeURIComponent(cartToken)}`
        : `${storeUrl}/checkout/`;

      return { ok: true, checkoutUrl };
    } catch (err) {
      console.error("Woo checkout error:", err);
      return { ok: false, error: "Checkout is temporarily unavailable. Please try again." };
    }
  });
