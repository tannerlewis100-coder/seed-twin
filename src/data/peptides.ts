export type Peptide = {
  slug: string;
  name: string;
  size: string;
  category: string;
  price: number;
  tag?: string;
  batch: string;
  purity: string; // e.g. "99.2%"
  description: string;
};

export const peptides: Peptide[] = [
  {
    slug: "bpc-157-10mg",
    name: "BPC-157",
    size: "10mg",
    category: "Recovery",
    price: 64.99,
    tag: "Bestseller",
    batch: "2406-BPC",
    purity: "99.2%",
    description: "A 15-amino-acid peptide derived from gastric protein, widely studied in repair and recovery research.",
  },
  {
    slug: "tb-500-5mg",
    name: "TB-500",
    size: "5mg",
    category: "Recovery",
    price: 79.99,
    tag: "Featured",
    batch: "2406-TB5",
    purity: "99.4%",
    description: "Synthetic fragment of Thymosin Beta-4 studied in tissue regeneration models.",
  },
  {
    slug: "ghk-cu-50mg",
    name: "GHK-Cu",
    size: "50mg",
    category: "Cosmetic",
    price: 89.99,
    tag: "New",
    batch: "2406-GHK",
    purity: "99.4%",
    description: "Copper tripeptide complex studied in skin and collagen research applications.",
  },
  {
    slug: "semax-30mg",
    name: "Semax",
    size: "30mg",
    category: "Cognitive",
    price: 119.99,
    batch: "2406-SMX",
    purity: "99.1%",
    description: "Heptapeptide derivative of ACTH studied in neuroprotection research.",
  },
  {
    slug: "selank-10mg",
    name: "Selank",
    size: "10mg",
    category: "Cognitive",
    price: 84.99,
    batch: "2406-SLK",
    purity: "99.3%",
    description: "Synthetic anxiolytic heptapeptide studied for stress-modulation research.",
  },
  {
    slug: "epitalon-50mg",
    name: "Epitalon",
    size: "50mg",
    category: "Longevity",
    price: 109.99,
    batch: "2406-EPI",
    purity: "99.5%",
    description: "Synthetic tetrapeptide studied in pineal gland and telomerase research.",
  },
  {
    slug: "mots-c-10mg",
    name: "MOTS-c",
    size: "10mg",
    category: "Metabolic",
    price: 134.99,
    batch: "2406-MTC",
    purity: "99.2%",
    description: "Mitochondrial-derived peptide studied in metabolic homeostasis research.",
  },
  {
    slug: "kpv-20mg",
    name: "KPV",
    size: "20mg",
    category: "Inflammation",
    price: 74.99,
    batch: "2406-KPV",
    purity: "99.6%",
    description: "Tripeptide fragment of α-MSH studied in inflammation research models.",
  },
];

export type CoaRow = { label: string; value: string };

export function sampleCoa(p: Peptide): CoaRow[] {
  return [
    { label: "HPLC Purity", value: p.purity },
    { label: "Mass Spec ID", value: "Confirmed" },
    { label: "Heavy Metals", value: "ND (Non-Detect)" },
    { label: "Microbial Count", value: "< 10 CFU/g" },
    { label: "Endotoxin (LAL)", value: "< 1 EU/mg" },
  ];
}
