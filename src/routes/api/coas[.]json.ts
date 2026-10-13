import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildCoaExport } from "@/lib/coaExport";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

// Built once per server instance, so updated_at reflects the deployed data.
let cached: ReturnType<typeof buildCoaExport> | null = null;

export const Route = createFileRoute("/api/coas.json")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        cached ??= buildCoaExport();
        return new Response(JSON.stringify(cached), {
          headers: {
            ...CORS,
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
