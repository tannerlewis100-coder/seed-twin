import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allPeptides } from "@/data/peptides";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Get full public details for a single Clarum peptide by slug: description, size, price, purity, batch, and Certificate of Analysis (COA) summary.",
  inputSchema: {
    slug: z.string().min(1).describe("Product slug, e.g. 'bpc-157-10mg'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const p = allPeptides.find((x) => x.slug === slug);
    if (!p) {
      return { content: [{ type: "text", text: `No product found with slug '${slug}'.` }], isError: true };
    }
    const data = {
      slug: p.slug,
      name: p.name,
      size: p.size,
      category: p.category,
      price_usd: p.price,
      badge: p.badge ?? null,
      batch: p.batch,
      purity: p.purity,
      description: p.description,
      coa: {
        identity: p.coa.identity,
        purity: p.coa.purity,
        assay: p.coa.assay,
        heavy_metals: p.coa.heavyMetals,
        tamc: p.coa.tamc,
        tymc: p.coa.tymc,
        sku: p.coa.sku,
        date: p.coa.date,
        form: p.coa.form,
        report_url: p.coaUrl ?? null,
        image_url: p.coaImage ? `https://clarumpeptides.com${p.coaImage}` : null,
        pending: p.coaPending ?? false,
      },
      url: `https://clarumpeptides.com/shop/${p.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
