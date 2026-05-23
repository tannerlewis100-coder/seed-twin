import { createFileRoute } from "@tanstack/react-router";

const WOO_BASE = "https://admin.clarumpeptides.com/wp-json/wc/store/v1";
const WP_JSON_BASE = "https://admin.clarumpeptides.com/wp-json";

function buildCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Cart-Token, Nonce, Authorization",
    Vary: "Origin",
  };
}

async function proxyToWoo(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");

  if (!path || !path.startsWith("/")) {
    return Response.json({ message: "Missing or invalid path." }, { status: 400 });
  }

  // Paths starting with "/clarum/" go to /wp-json directly so we can hit
  // the custom Clarum endpoints (e.g. /clarum/v1/products/{id}).
  // Everything else is treated as a Woo Store API path.
  const target = path.startsWith("/clarum/")
    ? new URL(`${WP_JSON_BASE}${path}`)
    : new URL(`${WOO_BASE}${path}`);
  const headers = new Headers();

  const accept = request.headers.get("accept");
  if (accept) headers.set("Accept", accept);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const cartToken = request.headers.get("cart-token");
  if (cartToken) headers.set("Cart-Token", cartToken);

  const nonce = request.headers.get("nonce");
  if (nonce) headers.set("Nonce", nonce);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();
  const passHeaders = [
    "content-type",
    "cart-token",
    "nonce",
    "location",
    "cart-hash",
  ];

  for (const header of passHeaders) {
    const value = upstream.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const Route = createFileRoute("/api/public/woo-store")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, {
          status: 204,
          headers: buildCorsHeaders(request.headers.get("origin")),
        }),
      GET: async ({ request }) => {
        const res = await proxyToWoo(request);
        const headers = new Headers(res.headers);
        const cors = buildCorsHeaders(request.headers.get("origin"));
        for (const [key, value] of Object.entries(cors)) headers.set(key, value);
        return new Response(res.body, { status: res.status, headers });
      },
      POST: async ({ request }) => {
        const res = await proxyToWoo(request);
        const headers = new Headers(res.headers);
        const cors = buildCorsHeaders(request.headers.get("origin"));
        for (const [key, value] of Object.entries(cors)) headers.set(key, value);
        return new Response(res.body, { status: res.status, headers });
      },
    },
  },
});