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

export const Route = createFileRoute("/api/public/attestly/otp-verify")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let body: { email?: string; code?: string } = {};
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, verified: false, error: "Invalid JSON body" }, 400);
        }
        if (!body.email || !body.code) {
          return json({ ok: false, verified: false, error: "email and code required" }, 400);
        }

        try {
          const upstream = await fetch("https://app.useattestly.com/api/connect/otp/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-Attestly-Site-Token": SITE_TOKEN,
            },
            body: JSON.stringify({ email: body.email, code: body.code }),
          });
          const data = (await upstream.json().catch(() => ({}))) as {
            ok?: boolean;
            verified?: boolean;
            token?: string;
            remaining?: number;
            error?: string;
          };
          return json({
            ok: !!data.ok,
            verified: !!data.verified,
            token: data.token,
            remaining: data.remaining,
            error: data.error,
          }, upstream.ok ? 200 : upstream.status);
        } catch (e) {
          return json(
            { ok: false, verified: false, error: e instanceof Error ? e.message : "otp-verify failed" },
            500,
          );
        }
      },
    },
  },
});
