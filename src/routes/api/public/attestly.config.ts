import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export const Route = createFileRoute("/api/public/attestly/config")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        const apiKey = process.env.ATTESTLY_API_KEY;
        const hub = process.env.ATTESTLY_HUB;
        if (!apiKey || !hub) {
          return new Response(
            JSON.stringify({ paymentsEnabled: false, error: "Attestly not configured" }),
            { status: 200, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
        try {
          const upstream = await fetch(`${hub}/api/connect/config`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: "application/json",
            },
          });
          const data = (await upstream.json().catch(() => ({}))) as {
            publishableKey?: string;
            stripeAccountId?: string;
            paymentsEnabled?: boolean;
          };
          return new Response(
            JSON.stringify({
              publishableKey: data.publishableKey ?? null,
              stripeAccountId: data.stripeAccountId ?? null,
              paymentsEnabled: !!data.paymentsEnabled && !!data.publishableKey && !!data.stripeAccountId,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...CORS } },
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ paymentsEnabled: false, error: e instanceof Error ? e.message : "fetch failed" }),
            { status: 200, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
      },
    },
  },
});
