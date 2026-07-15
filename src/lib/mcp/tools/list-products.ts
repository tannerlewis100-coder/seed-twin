import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allPeptides, categories } from "@/data/peptides";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List Clarum research peptides in the public catalog. Optionally filter by category. Returns slug, name, size, category, price, purity, and batch for each product.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optional category to filter by (e.g. 'Recovery', 'Growth Hormone', 'Longevity')."),
    limit: z.number().int().min(1).max(200).optional().describe("Max results to return (default all)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, limit }) => {
    let items = allPeptides;
    if (category) {
      const c = category.toLowerCase();
      items = items.filter((p) => p.category.toLowerCase() === c);
    }
    if (limit) items = items.slice(0, limit);
    const rows = items.map((p) => ({
      slug: p.slug,
      name: p.name,
      size: p.size,
      category: p.category,
      price_usd: p.price,
      purity: p.purity,
      batch: p.batch,
      url: `https://clarumpeptides.com/shop/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: rows.length, categories, items: rows }, null, 2) }],
      structuredContent: { count: rows.length, items: rows },
    };
  },
});
