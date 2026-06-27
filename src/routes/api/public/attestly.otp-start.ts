import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const SITE_TOKEN = "cmqscvrvs000i4opoyweu6kze";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export const Route = createFileRoute("/api/public/attestly/otp-start")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let body: { email?: string } = {};
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Invalid JSON body" }, 400);
        }
        if (!body.email) return json({ ok: false, error: "email required" }, 400);

        try {
          const upstream = await fetch("https://app.useattestly.com/api/connect/otp/start", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-Attestly-Site-Token": SITE_TOKEN,
            },
            body: JSON.stringify({ email: body.email }),
          });
          const data = (await upstream.json().catch(() => ({}))) as {
            ok?: boolean;
            error?: string;
          };
          if (!upstream.ok) {
            return json({ ok: false, error: data.error ?? "OTP start failed" }, upstream.status);
          }
          return json({ ok: !!data.ok });
        } catch (e) {
          return json({ ok: false, error: e instanceof Error ? e.message : "otp-start failed" }, 500);
        }
      },
    },
  },
});
