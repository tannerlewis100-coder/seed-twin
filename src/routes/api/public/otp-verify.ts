import { createFileRoute } from "@tanstack/react-router";

const WP = "https://admin.clarumpeptides.com/wp-json/clarum/v1/otp/verify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/otp-verify")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            email?: string;
            phone?: string;
            code?: string;
          };
          const email = body.email?.trim();
          const phone = body.phone?.trim();
          const code = body.code?.trim();
          if ((!email && !phone) || !code) {
            return new Response(
              JSON.stringify({ ok: false, verified: false, error: "Missing identifier or code" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
            );
          }
          const payload: Record<string, string> = email
            ? { email, code }
            : { phone: phone!, code };
          const upstream = await fetch(WP, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          const text = await upstream.text();
          let data: Record<string, unknown> = {};
          try { data = JSON.parse(text) as Record<string, unknown>; } catch { /* keep raw */ }
          // Surface upstream payload (verified, remaining, token, user, …) verbatim.
          const ok = upstream.ok && (data.verified === true || data.ok === true);
          return new Response(
            JSON.stringify({ ok, ...data }),
            {
              status: upstream.ok ? 200 : upstream.status,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        } catch (err) {
          return new Response(
            JSON.stringify({
              ok: false,
              verified: false,
              error: err instanceof Error ? err.message : "Failed",
            }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
          );
        }
      },
    },
  },
});
