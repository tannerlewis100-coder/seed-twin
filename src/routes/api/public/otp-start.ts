import { createFileRoute } from "@tanstack/react-router";

const WP = "https://admin.clarumpeptides.com/wp-json/clarum/v1/otp/send";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/otp-start")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const { email } = (await request.json()) as { email?: string };
          if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }
          const upstream = await fetch(WP, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email }),
          });
          const text = await upstream.text();
          let data: unknown = {};
          try { data = JSON.parse(text); } catch { /* keep raw */ }
          const ok = upstream.ok;
          return new Response(
            JSON.stringify({ ok, ...(typeof data === "object" && data ? data : { raw: text }) }),
            {
              status: upstream.ok ? 200 : upstream.status,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Failed" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
          );
        }
      },
    },
  },
});
