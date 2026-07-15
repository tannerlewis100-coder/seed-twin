import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allPeptides } from "@/data/peptides";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Full-text search across Clarum's research peptide catalog. Matches slug, name, category, and description.",
  inputSchema: {
    query: z.string().min(1).describe("Search terms, e.g. 'bpc', 'growth hormone', 'weight'."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const hits = allPeptides
      .filter(
        (p) =>
          p.slug.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, limit ?? 20)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        size: p.size,
        category: p.category,
        price_usd: p.price,
        purity: p.purity,
        url: `https://clarumpeptides.com/shop/${p.slug}`,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: hits.length, items: hits }, null, 2) }],
      structuredContent: { count: hits.length, items: hits },
    };
  },
});
