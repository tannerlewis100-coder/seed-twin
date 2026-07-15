import { defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";

export default defineMcp({
  name: "clarum-peptides-mcp",
  title: "Clarum Peptides",
  version: "0.1.0",
  instructions:
    "Public catalog for Clarum research peptides. Use `list_products` to browse (optionally by category), `search_products` for keyword search, and `get_product` for full details including Certificate of Analysis (COA) summary. All data is public research-catalog information; no user accounts or orders are exposed.",
  tools: [listProducts, searchProducts, getProduct],
});
