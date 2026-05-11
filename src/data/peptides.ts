export type CoaData = {
  purity: string;
  assay: string;
  identity: "Confirmed";
  heavyMetals: "<20ppb";
  tamc: "0 CFU";
  tymc: "0 CFU";
  sku: string;
  date: string;
  form: string;
};

export type Peptide = {
  slug: string;
  name: string;
  size: string;
  category: string;
  price: number;
  badge?: string;
  /** Backwards-compat alias for badge */
  tag?: string;
  batch: string;
  purity: string;
  description: string;
  coa: CoaData;
  coaImage?: string;
  coaUrl?: string;
};

const D = "Jan 14, 2026";
const C: Pick<CoaData, "identity" | "heavyMetals" | "tamc" | "tymc"> = {
  identity: "Confirmed",
  heavyMetals: "<20ppb",
  tamc: "0 CFU",
  tymc: "0 CFU",
};

function coa(purity: string, assay: string, sku: string, form: string, date = D): CoaData {
  return { purity, assay, ...C, sku, date, form };
}

/** Long-form research descriptions keyed by base slug */
const descriptions: Record<string, string> = {
  "bpc-157":
    "BPC-157 is a 15-amino acid peptide derived from a protective protein naturally found in gastric juice. It is one of the most extensively studied compounds in recovery and tissue biology research, with hundreds of published animal and in vitro studies examining its role in cellular repair signaling, connective tissue integrity, angiogenesis, and growth hormone receptor interaction.",
  "tb-500":
    "TB-500 is the synthetic form of Thymosin Beta-4, a protein naturally present in virtually every cell. Research has focused on its critical role in actin regulation — the protein that governs cell structure, movement, and tissue organization — and on involvement in blood-vessel formation, cellular migration, inflammatory response modulation, and soft tissue repair signaling in animal models.",
  "wolverine-blend":
    "Two of the most studied recovery peptides combined in a single vial. BPC-157 and TB-500 have each independently accumulated significant published research around tissue signaling and repair mechanisms. Researchers have studied their complementary pathways in tandem.",
  "ll-37":
    "LL-37 is the only known human cathelicidin antimicrobial peptide — a naturally occurring 37-amino acid sequence with broad research applications in immunology and microbiology, studied for antimicrobial mechanisms, immune modulation, angiogenic activity, and wound healing signaling.",
  "ara-290":
    "ARA-290 is a peptide analog of Erythropoietin engineered to selectively activate the innate repair receptor without triggering erythropoietic effects. Research has explored its role in neuroprotection, anti-inflammatory signaling, and tissue repair mechanisms in animal and human studies.",
  "pnc-27":
    "PNC-27 is a peptide containing a p53-derived sequence linked to a membrane-residing peptide. It has been studied in cancer research models for its interaction with cellular membranes and selective cytotoxicity in tumor cell lines.",
  sermorelin:
    "Sermorelin is a 29-amino acid analog representing the biologically active fragment of growth hormone releasing hormone. It is the oldest and most clinically studied GHRH analog, with a history of FDA approval and extensive published research on GH axis stimulation.",
  "cjc-1295-without-dac":
    "CJC-1295 Without DAC, also known as Modified GRF(1-29), is a synthetic GHRH analog optimized for research pulse studies. It stimulates GH secretion through pituitary GHRH receptors while preserving the natural pulsatile release pattern observed in animal models.",
  "cjc-1295-with-dac":
    "The Drug Affinity Complex formulation of CJC-1295 extends the half-life to approximately 6–8 days in animal studies through covalent albumin binding — the longest-acting GHRH analog available for research.",
  "2x-blend-cjc-ipamorelin":
    "The most studied GHRH and GHRP combination in research — CJC-1295 Without DAC paired with Ipamorelin in equal doses, with combined protocols showing amplified GH pulse responses in animal models compared to either peptide alone.",
  ipamorelin:
    "Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor agonist widely regarded as one of the cleanest GH-releasing peptides studied, noted for stimulating GH release without significantly elevating cortisol, prolactin, or ACTH in animal models.",
  tesamorelin:
    "Tesamorelin is an FDA-approved GHRH analog sold under the brand name Egrifta, with extensive Phase III trial data covering its effects on visceral fat, IGF-1 levels, and metabolic parameters.",
  "ghrp-6-acetate":
    "GHRP-6 is one of the original and most studied growth hormone releasing peptides, with decades of research examining its dual action through GHRP and ghrelin receptors. Notable for strong appetite-stimulating activity via the ghrelin pathway.",
  "hexarelin-acetate":
    "Hexarelin is among the most potent synthetic growth hormone secretagogues studied, with research suggesting greater GH-releasing activity than GHRP-6 on a molar basis. Studies have also explored CD36 receptor interaction and cardiac tissue effects.",
  hcg: "Human Chorionic Gonadotropin is a glycoprotein hormone that acts as a functional analog of Luteinizing Hormone, binding to LH receptors. Studied in Leydig cell stimulation, testosterone biosynthesis signaling, and HPG-axis research in animal models.",
  hmg: "Human Menopausal Gonadotropin is a preparation containing follicle-stimulating and luteinizing hormone activity, used as a reference compound in reproductive endocrinology research.",
  "igf-1-lr3":
    "IGF-1 LR3 is a modified analog of Insulin-like Growth Factor 1, engineered with an arginine substitution and 13-amino acid N-terminal extension that dramatically extends its half-life. Studied in muscle cell proliferation, satellite cell activation, and downstream mTOR/PI3K signaling.",
  "igf-des":
    "IGF-DES is a truncated form of IGF-1 lacking the first three N-terminal amino acids. Research has explored its localized signaling activity and rapid clearance profile.",
  "gdf-8":
    "Myostatin (GDF-8) is a member of the TGF-beta superfamily and acts as the body's primary brake on skeletal muscle growth. Research has explored it extensively as a regulatory target in muscle wasting disease models, metabolic research, and lean mass biology.",
  "ace-031":
    "ACE-031 is a soluble activin receptor type IIB fusion protein studied as an inhibitor of myostatin signaling. Animal research has documented effects on lean mass and metabolic parameters.",
  "n-acetyl-epitalon-amidate":
    "The acetylated and amidated form of Epitalon, engineered for enhanced molecular stability in research settings. Carries the same extensively published research profile as Epitalon — telomerase activity, pineal function, aging-pathway research — with improved structural durability.",
  epitalon:
    "Epitalon is a synthetic tetrapeptide developed from over 35 years of research by Professor Vladimir Khavinson. Considered one of the most significant compounds in telomere biology and longevity research, with studies exploring telomerase activation, pineal gland function, melatonin regulation, and cellular aging mechanisms.",
  "mots-c":
    "MOTS-c is a peptide encoded within the mitochondrial genome itself — a discovery that fundamentally changed how researchers understand mitochondrial communication. Studies have explored metabolic regulation, insulin sensitivity pathways, and AMPK activation.",
  "ss-31":
    "SS-31, also known as Elamipretide, is a mitochondria-targeted tetrapeptide that has advanced into Phase II/III human clinical trials. Studies focus on its interaction with cardiolipin in the inner mitochondrial membrane and oxidative stress modulation.",
  foxo4:
    "FOXO4 is a transcription factor peptide at the center of senolytic research — the scientific study of identifying and clearing senescent cells. A landmark Nature Medicine study explored FOXO4 interaction with the p53 survival pathway in animal models.",
  pinealon:
    "Pinealon is a tripeptide developed alongside Epitalon in Professor Khavinson's bioregulatory peptide research program. Studies have investigated its interactions with the central nervous system and neuroendocrine centers.",
  thymalin:
    "Thymalin is a polypeptide extract derived from the thymus gland, with decades of published research primarily from Russian and Eastern European institutions exploring immune modulation, thymic function, and aging-related immune decline.",
  "ghk-cu":
    "GHK-Cu is one of the most studied peptides in scientific history, with over 50 years of published research and more than 4,000 papers. A naturally occurring copper-binding peptide that declines with age, studied in wound healing signaling, collagen and elastin synthesis, and tissue remodeling.",
  "glow-blend":
    "GLOW combines GHK-Cu with BPC-157 and TB-500 — three of the most studied peptides in skin and tissue research — into a single research blend.",
  "snap-8":
    "Snap-8 is a synthetic octapeptide analog of Argireline studied for effects on the SNARE protein complex — the molecular machinery responsible for neurotransmitter release at the neuromuscular junction.",
  "melanotan-2":
    "Melanotan II is a synthetic analog of alpha-MSH that binds broadly across the melanocortin receptor family (MC1R through MC5R). Studied for pigmentation signaling, sexual arousal pathway activation, and appetite modulation in animal models.",
  semax:
    "Semax is a synthetic heptapeptide analog of ACTH(4-7), developed by the Institute of Molecular Genetics of the Russian Academy of Sciences. Studied for interactions with BDNF pathways, dopaminergic and serotonergic systems, and neuroprotective mechanisms.",
  selank:
    "Selank is a synthetic analog of the endogenous immunopeptide Tuftsin. Research has explored its interactions with GABAergic systems, IL-6 modulation, and anxiolytic pathways in animal models.",
  dsip:
    "Delta Sleep-Inducing Peptide (DSIP) is a nonapeptide first isolated in 1974 from rabbit cerebral venous blood during slow-wave sleep, with nearly five decades of literature exploring sleep architecture regulation and stress response modulation.",
  "thymosin-alpha-1":
    "Thymosin Alpha-1 is a 28-amino acid peptide derived from prothymosin alpha and one of the most clinically validated immunomodulatory peptides in existence. Approved as a pharmaceutical drug in over 35 countries under the brand name Zadaxin.",
  "kpv-lysine-proline-valine":
    "KPV (Lysine-Proline-Valine) is the C-terminal tripeptide of alpha-MSH and has been studied for its role in NF-κB pathway modulation and anti-inflammatory signaling in cell and animal models.",
  vip10:
    "Vasoactive Intestinal Peptide (VIP) is a 28-amino acid neuropeptide found throughout the central and peripheral nervous systems. Studied for vasodilatory effects, immunomodulatory properties, and circadian rhythm regulation.",
  "5-amino-1mq":
    "5-Amino-1MQ is a small molecule inhibitor of NNMT (Nicotinamide N-methyltransferase), an enzyme central to cellular energy metabolism and fat storage regulation. Researched for metabolic reprogramming and NAD+ pathway modulation.",
  "aod-9604":
    "AOD-9604 is a modified fragment of human growth hormone — specifically the C-terminal region studied for its role in fat metabolism signaling. Research suggests it does not affect insulin-like growth factors in animal models.",
  aicar:
    "AICAR is an AMPK activator extensively studied as an exercise mimetic compound. Animal research has explored effects on endurance capacity, mitochondrial biogenesis, fat oxidation, and glucose uptake.",
  cagrilintide:
    "Cagrilintide is a long-acting amylin analog currently in active Phase III clinical trials, including Novo Nordisk's CagriSema program. Research focuses on appetite regulation, gastric emptying, and amylin-receptor metabolic signaling.",
  mazdutide:
    "Mazdutide is a dual GLP-1 and glucagon receptor agonist in active clinical development for metabolic research, with studies exploring effects on body weight and glycemic parameters.",
  survodutide:
    "Survodutide is a dual GLP-1 and glucagon receptor agonist in active clinical research, studied in metabolic and weight-management contexts.",
  "slu-pp-332":
    "SLU-PP-332 is an ERR pan-agonist that has attracted significant research attention as an exercise mimetic. Animal research has documented effects on endurance capacity, mitochondrial gene expression, and metabolic rate.",
  "glp-3-rz":
    "GLP-3 RZ is a research peptide in the GLP family currently being explored in metabolic and weight-management research models.",
  nad: "Nicotinamide Adenine Dinucleotide (NAD+) is a coenzyme present in every living cell and one of the central molecules in modern longevity research, with studies exploring sirtuin activation, DNA repair signaling, mitochondrial function, and cellular energy metabolism.",
  glutathione:
    "Glutathione is the body's master endogenous antioxidant — a tripeptide of glycine, cysteine, and glutamate central to cellular redox balance, detoxification pathways, and immune regulation research.",
  "pt-141":
    "PT-141, known pharmaceutically as Bremelanotide, is an FDA-approved melanocortin receptor agonist. Research has explored its activation of MC3R and MC4R receptors and central nervous system role in arousal-pathway research.",
  kisspeptin:
    "Kisspeptin is a neuropeptide encoded by the KISS1 gene and recognized as the master upstream regulator of the hypothalamic-pituitary-gonadal axis, with research exploring GnRH pulse generation and reproductive function.",
  "klow-blend":
    "KLOW combines GHK-Cu, KPV, BPC-157, and TB-500 — four of the most studied peptides in tissue, immune, and skin research — into a single research blend.",
  "8x-lipo":
    "An 8-component lipotropic blend (L-Carnitine, L-Arginine, Methionine, Inositol, Choline, B6, B5, B12) used as a reference compound in metabolic and nutritional research.",
  "4x-mic":
    "A 4-component MIC blend (Methionine, Choline Chloride, Carnitine, Dexpanthenol) used as a reference compound in metabolic research.",
  b12:
    "Methylcobalamin B12 is an essential coenzyme studied for its critical role in methylation pathways, neurological function, DNA synthesis, and red blood cell formation signaling.",
  "recon-water":
    "Bacteriostatic / sterile water for reconstituting lyophilized research peptides. Lab supply only.",
};

function descFor(slug: string, fallback: string): string {
  return descriptions[slug] ?? fallback;
}

export const allPeptides: Peptide[] = [
  // ── Recovery & Repair ──
  { slug: "bpc-157-5mg", name: "BPC-157", size: "5mg", category: "Recovery", price: 59, badge: "BEST SELLER", batch: "2406-BPC5", purity: "99.5%", description: descFor("bpc-157", ""), coa: coa("99.5%", "5.00mg", "YPB.212", "5mg Lyophilized Powder"), coaImage: "/coa/BPC-157-(5mg).png", coaUrl: "https://drive.google.com/drive/folders/1yd1qbGOUm1hx-Oba_5_opRq6-jLn2dSv" },
  { slug: "bpc-157-10mg", name: "BPC-157", size: "10mg", category: "Recovery", price: 119, badge: "BEST SELLER", batch: "2406-BPC10", purity: "99.9%", description: descFor("bpc-157", ""), coa: coa("99.9%", "10.02mg", "YPB.213", "10mg Lyophilized Powder"), coaImage: "/coa/BPC-157-(10mg).png", coaUrl: "https://drive.google.com/drive/folders/12UTrpVLuQ8UMISTPpXRBhZkVRXbJ1HVj" },
  { slug: "bpc-157-20mg", name: "BPC-157", size: "20mg", category: "Recovery", price: 179, badge: "BEST SELLER", batch: "2406-BPC20", purity: "99.8%", description: descFor("bpc-157", ""), coa: coa("99.8%", "20.04mg", "YPB.237", "20mg Lyophilized Powder"), coaImage: "/coa/BPC-157-(20mg).png", coaUrl: "https://drive.google.com/drive/folders/1vaS1-9c_b2Jh1H5CSUZRsoF7Q74j-Yft" },
  { slug: "tb-500-5mg", name: "TB-500", size: "5mg", category: "Recovery", price: 89, batch: "2406-TB5", purity: "99.9%", description: descFor("tb-500", ""), coa: coa("99.9%", "5.08mg", "YPB.214", "5mg Lyophilized Powder"), coaImage: "/coa/TB-500-(5mg).png", coaUrl: "https://drive.google.com/drive/folders/17aYRCyuDt3TsUaH9w2oxgNPjjsT2_yzV" },
  { slug: "tb-500-10mg", name: "TB-500", size: "10mg", category: "Recovery", price: 159, batch: "2406-TB10", purity: "99.8%", description: descFor("tb-500", ""), coa: coa("99.8%", "10.28mg", "YPB.215", "10mg Lyophilized Powder"), coaImage: "/coa/TB-500-(10mg).png", coaUrl: "https://drive.google.com/drive/folders/1dC4JEl2LB0x21L4X652bgM1XLOgm0vXw" },
  { slug: "wolverine-5mg-r", name: "Wolverine Blend", size: "5mg/5mg", category: "Recovery", price: 125, batch: "2406-WLV5", purity: "99.7%", description: descFor("wolverine-blend", ""), coa: coa("99.7%", "10.06mg", "YPB.216", "BPC-157 (5mg) / TB500 (5mg)"), coaImage: "/coa/Wolverine-Blend-(5mg5mg).png", coaUrl: "https://drive.google.com/drive/folders/1hfyQ4hNDTcSy974vVKxzLtjXtBamqsHU" },
  { slug: "wolverine-10mg-r", name: "Wolverine Blend", size: "10mg/10mg", category: "Recovery", price: 199, batch: "2406-WLV10", purity: "99.6%", description: descFor("wolverine-blend", ""), coa: coa("99.6%", "20.12mg", "YPB.217", "BPC-157 (10mg) / TB500 (10mg)"), coaImage: "/coa/Wolverine-Blend-(10mg10mg).png", coaUrl: "https://drive.google.com/drive/folders/1mUATcAAmdMYQzR7tv16dvwnYDNLbAlo3" },
  { slug: "ll-37", name: "LL-37", size: "5mg", category: "Recovery", price: 129, batch: "2406-LL37", purity: "99.5%", description: descFor("ll-37", ""), coa: coa("99.5%", "5.02mg", "YPB.244", "5mg Lyophilized Powder"), coaImage: "/coa/LL37.png", coaUrl: "https://drive.google.com/drive/folders/17d8N9cUiIPZpqMwM2RsQg1V_ZyGA6xck" },
  { slug: "ara-290", name: "ARA-290", size: "10mg", category: "Recovery", price: 159, batch: "2406-ARA", purity: "99.8%", description: descFor("ara-290", ""), coa: coa("99.8%", "9.97mg", "YPB.277", "10mg Lyophilized Powder") },
  { slug: "pnc-27", name: "PNC-27", size: "10mg", category: "Recovery", price: 199, batch: "2406-PNC", purity: "99.1%", description: descFor("pnc-27", ""), coa: coa("99.1%", "10.04mg", "YPB.275", "10mg Lyophilized Powder") },

  // ── Growth Hormone ──
  { slug: "sermorelin", name: "Sermorelin", size: "10mg", category: "Growth Hormone", price: 115, batch: "2406-SER", purity: "99.2%", description: descFor("sermorelin", ""), coa: coa("99.2%", "9.91mg", "YPB.211", "10mg Lyophilized Powder"), coaImage: "/coa/Sermorelin.png", coaUrl: "https://drive.google.com/drive/folders/1XQeNykEKE6KpHV2RDGH5GBRyanziS4_W" },
  { slug: "cjc-nodac", name: "CJC-1295 Without DAC", size: "10mg", category: "Growth Hormone", price: 99, batch: "2406-CJCND", purity: "99.9%", description: descFor("cjc-1295-without-dac", ""), coa: coa("99.9%", "10.16mg", "YPB.219", "10mg Lyophilized Powder"), coaImage: "/coa/CJC-1295-Without-DAC.png", coaUrl: "https://drive.google.com/drive/folders/1jUglWPQNA5I1P4czrEkNAuujNMKxdNZb" },
  { slug: "cjc-dac", name: "CJC-1295 With DAC", size: "5mg", category: "Growth Hormone", price: 109, batch: "2406-CJCD", purity: "99.5%", description: descFor("cjc-1295-with-dac", ""), coa: coa("99.5%", "5.04mg", "YPB.220", "5mg Lyophilized Powder"), coaImage: "/coa/CJC-1295-With-DAC.png", coaUrl: "https://drive.google.com/drive/folders/1jz137QnZeh--fq8syBHLX5Ke0urUYgDF" },
  { slug: "cjc-ipa-blend", name: "Blend CJC/Ipamorelin", size: "5mg/5mg", category: "Growth Hormone", price: 105, batch: "2406-CJIP", purity: "99.6%", description: descFor("2x-blend-cjc-ipamorelin", ""), coa: coa("99.6%", "10.08mg", "YPB.238", "CJC-1295 Without DAC (5mg) / Ipamorelin (5mg)"), coaImage: "/coa/2X-Blend-CJCIpamorelin.png", coaUrl: "https://drive.google.com/drive/folders/175q_zN_FmHt6b3XuSZGe7oG03g3eRrl9" },
  { slug: "ipamorelin", name: "Ipamorelin", size: "10mg", category: "Growth Hormone", price: 129, batch: "2406-IPA", purity: "99.7%", description: descFor("ipamorelin", ""), coa: coa("99.7%", "10.12mg", "YPB.263", "10mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/1dmSoTwRBZscv3zqwxev_Vi6ZciV6t0U_" },
  { slug: "tesamorelin-10mg", name: "Tesamorelin", size: "10mg", category: "Growth Hormone", price: 165, batch: "2406-TES10", purity: "99.3%", description: descFor("tesamorelin", ""), coa: coa("99.3%", "9.98mg", "YPB.279", "10mg Lyophilized Powder") },
  { slug: "tesamorelin-20mg", name: "Tesamorelin", size: "20mg", category: "Growth Hormone", price: 299, batch: "2406-TES20", purity: "99.2%", description: descFor("tesamorelin", ""), coa: coa("99.2%", "20.06mg", "YPB.273", "20mg Lyophilized Powder") },
  { slug: "ghrp-6-5mg", name: "GHRP-6 Acetate", size: "5mg", category: "Growth Hormone", price: 99, batch: "2406-GH65", purity: "99.9%", description: descFor("ghrp-6-acetate", ""), coa: coa("99.9%", "4.99mg", "YPB.282", "5mg Lyophilized Powder"), coaImage: "/coa/GHRP-6-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/14Jp9mA9lOO2vwaRWo3MUw-RiYd4RNH8e" },
  { slug: "ghrp-6-10mg", name: "GHRP-6 Acetate", size: "10mg", category: "Growth Hormone", price: 129, batch: "2406-GH610", purity: "99.6%", description: descFor("ghrp-6-acetate", ""), coa: coa("99.6%", "10.08mg", "YPB.257", "10mg Lyophilized Powder"), coaImage: "/coa/GHRP-6-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/14Jp9mA9lOO2vwaRWo3MUw-RiYd4RNH8e" },
  { slug: "hexarelin", name: "Hexarelin Acetate", size: "5mg", category: "Growth Hormone", price: 139, batch: "2406-HEX", purity: "99.4%", description: descFor("hexarelin-acetate", ""), coa: coa("99.4%", "5.06mg", "YPB.261", "5mg Lyophilized Powder"), coaImage: "/coa/Hexarelin-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/12c8HFS-BCAlz3RVDrDwgFjlVFbMkxTKu" },
  { slug: "hcg", name: "HCG", size: "10000iu", category: "Growth Hormone", price: 189, batch: "2406-HCG", purity: "99.3%", description: descFor("hcg", ""), coa: coa("99.3%", "10000iu", "YPB.290", "10000iu Lyophilized Powder") },
  { slug: "hmg", name: "HMG", size: "75iu", category: "Growth Hormone", price: 149, batch: "2406-HMG", purity: "99.1%", description: descFor("hmg", ""), coa: coa("99.1%", "75iu", "YPB.291", "75iu Lyophilized Powder") },
  { slug: "igf-1-lr3-01mg", name: "IGF-1 LR3", size: "0.1mg", category: "Growth Hormone", price: 89, batch: "2406-IGF01", purity: "98.9%", description: descFor("igf-1-lr3", ""), coa: coa("98.9%", "0.10mg", "YPB.292", "0.1mg Lyophilized Powder") },
  { slug: "igf-1-lr3-1mg", name: "IGF-1 LR3", size: "1mg", category: "Growth Hormone", price: 200, batch: "2406-IGF1", purity: "99.1%", description: descFor("igf-1-lr3", ""), coa: coa("99.1%", "1.01mg", "YPB.249", "1mg Lyophilized Powder") },
  { slug: "igf-des", name: "IGF-DES", size: "0.1mg", category: "Growth Hormone", price: 99, batch: "2406-IGFD", purity: "98.7%", description: descFor("igf-des", ""), coa: coa("98.7%", "0.10mg", "YPB.293", "0.1mg Lyophilized Powder") },
  { slug: "gdf-8", name: "GDF-8", size: "1mg", category: "Growth Hormone", price: 249, batch: "2406-GDF8", purity: "99.1%", description: descFor("gdf-8", ""), coa: coa("99.1%", "1.01mg", "YPB.233", "1mg Lyophilized Powder"), coaImage: "/coa/GDF-8.png", coaUrl: "https://drive.google.com/drive/folders/1zcwNXLSprpD4bdkfq4aWmgYb2XQaB21y" },
  { slug: "ace-031", name: "ACE-031", size: "1mg", category: "Growth Hormone", price: 279, batch: "2406-ACE", purity: "98.9%", description: descFor("ace-031", ""), coa: coa("98.9%", "1.01mg", "YPB.249", "1mg Lyophilized Powder"), coaImage: "/coa/ACE-031.png", coaUrl: "https://drive.google.com/drive/folders/1b8uaBjUSVqbWIhqBaKdk9xAi4R-IhlLl" },

  // ── Longevity ──
  { slug: "na-epitalon", name: "N-Acetyl Epitalon Amidate", size: "5mg", category: "Longevity", price: 115, batch: "2406-NAEP", purity: "99.5%", description: descFor("n-acetyl-epitalon-amidate", ""), coa: coa("99.5%", "5.02mg", "YPB.232", "5mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/1gsQaTw_8aJ6IYO1tJO6dKUBvLagE5kQx" },
  { slug: "epitalon-10mg", name: "Epitalon", size: "10mg", category: "Longevity", price: 115, batch: "2406-EPI10", purity: "99.7%", description: descFor("epitalon", ""), coa: coa("99.7%", "10.04mg", "YPB.253", "10mg Lyophilized Powder"), coaImage: "/coa/Epitalon-(10mg).png", coaUrl: "https://drive.google.com/drive/folders/1QVWwNjLCwVdRx_EkTASI56AIyOWRDmSq" },
  { slug: "epitalon-50mg", name: "Epitalon", size: "50mg", category: "Longevity", price: 165, batch: "2406-EPI50", purity: "99.5%", description: descFor("epitalon", ""), coa: coa("99.5%", "50.87mg", "YPB.254", "50mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/1N9FKjhYb7--H7dg-XQkAoeIc0qyRCzMo" },
  { slug: "mots-c-10mg", name: "MOTS-c", size: "10mg", category: "Longevity", price: 120, batch: "2406-MOT10", purity: "99.6%", description: descFor("mots-c", ""), coa: coa("99.6%", "10.05mg", "YPB.227", "10mg Lyophilized Powder"), coaImage: "/coa/MOTS-c.png", coaUrl: "https://drive.google.com/drive/folders/17tMWs6D6C1_h8ZBndWqB8I5CWbvt8vYC" },
  { slug: "mots-c-40mg", name: "MOTS-c", size: "40mg", category: "Longevity", price: 250, batch: "2406-MOT40", purity: "99.8%", description: descFor("mots-c", ""), coa: coa("99.8%", "39.68mg", "YPB.271", "40mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/17tMWs6D6C1_h8ZBndWqB8I5CWbvt8vYC" },
  { slug: "ss-31-10mg", name: "SS-31", size: "10mg", category: "Longevity", price: 139, batch: "2406-SS10", purity: "99.4%", description: descFor("ss-31", ""), coa: coa("99.4%", "10.11mg", "YPB.294", "10mg Lyophilized Powder"), coaImage: "/coa/SS-31-(10mg).png", coaUrl: "https://drive.google.com/drive/folders/1QYjXK43cip4YTsHj3J3gNifS9kg4GvfS" },
  { slug: "ss-31-50mg", name: "SS-31", size: "50mg", category: "Longevity", price: 279, batch: "2406-SS50", purity: "99.2%", description: descFor("ss-31", ""), coa: coa("99.2%", "50.44mg", "YPB.295", "50mg Lyophilized Powder"), coaImage: "/coa/SS-31-(50mg).png", coaUrl: "https://drive.google.com/drive/folders/1H7d3L5WZsNhcb1tLM9ppGvogoOBCi-7B" },
  { slug: "foxo4", name: "FOXO4", size: "10mg", category: "Longevity", price: 349, batch: "2406-FOX4", purity: "99.2%", description: descFor("foxo4", ""), coa: coa("99.2%", "9.94mg", "YPB.255", "10mg Lyophilized Powder"), coaImage: "/coa/FOXO4.png", coaUrl: "https://drive.google.com/drive/folders/1c-MRQpSIJbowMnU2z2aROU5UccrZehwq" },
  { slug: "pinealon", name: "Pinealon", size: "20mg", category: "Longevity", price: 135, batch: "2406-PIN", purity: "99.2%", description: descFor("pinealon", ""), coa: coa("99.2%", "20.06mg", "YPB.273", "20mg Lyophilized Powder") },
  { slug: "thymalin", name: "Thymalin", size: "10mg", category: "Longevity", price: 149, batch: "2406-THYM", purity: "99.2%", description: descFor("thymalin", ""), coa: coa("99.2%", "10.08mg", "YPB.280", "10mg Lyophilized Powder") },

  // ── Skin ──
  { slug: "ghk-cu-50mg", name: "GHK-Cu", size: "50mg", category: "Skin", price: 95, batch: "2406-GHK50", purity: "99.3%", description: descFor("ghk-cu", ""), coa: coa("99.3%", "50.22mg", "YPB.221", "50mg Lyophilized Powder"), coaImage: "/coa/GHK-Cu-(50mg).png", coaUrl: "https://drive.google.com/drive/folders/1sSdOORuQnubbJY5sT-hv87MY2WKvZN9J" },
  { slug: "ghk-cu-100mg", name: "GHK-Cu", size: "100mg", category: "Skin", price: 149, batch: "2406-GHK100", purity: "99.1%", description: descFor("ghk-cu", ""), coa: coa("99.1%", "100.5mg", "YPB.222", "100mg Lyophilized Powder"), coaImage: "/coa/GHK-Cu-(100mg).png", coaUrl: "https://drive.google.com/drive/folders/1rQ4mjGwRmR0aIATaMTrOvXC83MlSTLpf" },
  { slug: "glow-blend-s", name: "GLOW Blend — GHK-Cu/BPC-157/TB-500", size: "70mg", category: "Skin", price: 279, batch: "2406-GLOW", purity: "99.4%", description: descFor("glow-blend", ""), coa: coa("99.4%", "70.08mg", "YPB.218", "GHK-Cu (50mg) / BPC-157 (10mg) / TB500 (10mg)"), coaImage: "/coa/GLOW.png", coaUrl: "https://drive.google.com/drive/folders/1bgn9BYPOLEmtsIdG2-MBUN4XvkCaROJF" },
  { slug: "snap-8", name: "Snap-8", size: "10mg", category: "Skin", price: 115, batch: "2406-SNAP", purity: "99.4%", description: descFor("snap-8", ""), coa: coa("99.4%", "10.11mg", "YPB.272", "10mg Lyophilized Powder") },
  { slug: "melanotan-ii", name: "Melanotan 2", size: "10mg", category: "Skin", price: 115, batch: "2406-MEL2", purity: "99.3%", description: descFor("melanotan-2", ""), coa: coa("99.3%", "10.08mg", "YPB.270", "10mg Lyophilized Powder"), coaImage: "/coa/Melanotan-2.png", coaUrl: "https://drive.google.com/drive/folders/1APgBbJggit5MijjjXXcWP9OEh-JgAjBO" },

  // ── Cognitive ──
  { slug: "semax", name: "Semax", size: "10mg", category: "Cognitive", price: 79, batch: "2406-SEM", purity: "99.2%", description: descFor("semax", ""), coa: coa("99.2%", "10.06mg", "YPB.229", "10mg Lyophilized Powder"), coaImage: "/coa/Semax.png", coaUrl: "https://drive.google.com/drive/folders/1pjHSiPz0Q7-eFy4zA2gYVhNG_gHJLsV9" },
  { slug: "selank", name: "Selank", size: "10mg", category: "Cognitive", price: 79, batch: "2406-SEL", purity: "99.5%", description: descFor("selank", ""), coa: coa("99.5%", "10.04mg", "YPB.228", "10mg Lyophilized Powder"), coaImage: "/coa/Selank.png", coaUrl: "https://drive.google.com/drive/folders/1el17hsIyDWT7BP9VHHLCPhUvsrMqRWFd" },
  { slug: "dsip-5mg", name: "DSIP", size: "5mg", category: "Cognitive", price: 89, batch: "2406-DSIP5", purity: "98.8%", description: descFor("dsip", ""), coa: coa("98.8%", "5.39mg", "YPB.252", "5mg Lyophilized Powder"), coaImage: "/coa/DSIP-(5mg).png", coaUrl: "https://drive.google.com/drive/folders/1nqYFphuA6rFa4dj5sKLwd152P4M7Iye9" },
  { slug: "dsip-15mg", name: "DSIP", size: "15mg", category: "Cognitive", price: 129, batch: "2406-DSIP15", purity: "98.8%", description: descFor("dsip", ""), coa: coa("98.8%", "15.12mg", "YPB.230", "15mg Lyophilized Powder"), coaImage: "/coa/DSIP-(15mg).png", coaUrl: "https://drive.google.com/drive/folders/1LYF_ihZzZkydp70od9G2HTaAiubN4KFV" },

  // ── Immune ──
  { slug: "ta-1", name: "Thymosin Alpha 1", size: "10mg", category: "Immune", price: 139, batch: "2406-TA1", purity: "99.7%", description: descFor("thymosin-alpha-1", ""), coa: coa("99.7%", "10.06mg", "YPB.231", "10mg Lyophilized Powder"), coaImage: "/coa/Thymosin-Alpha-1.png", coaUrl: "https://drive.google.com/drive/folders/1WnbGc1Z7vIaS9dQT4Mq2fIgy9xVQxML4" },
  { slug: "kpv", name: "KPV / Lysine-Proline-Valine", size: "10mg", category: "Immune", price: 129, batch: "2406-KPV", purity: "99.6%", description: descFor("kpv-lysine-proline-valine", ""), coa: coa("99.6%", "10.14mg", "YPB.265", "10mg Lyophilized Powder"), coaImage: "/coa/KPV.png", coaUrl: "https://drive.google.com/drive/folders/1OY5VSh_dIld7GaRqPx9qbH3I782lJ9y2" },
  { slug: "vip10", name: "VIP10", size: "10mg", category: "Immune", price: 199, batch: "2406-VIP", purity: "99.4%", description: descFor("vip10", ""), coa: coa("99.4%", "10.06mg", "YPB.281", "10mg Lyophilized Powder") },

  // ── Weight Management ──
  { slug: "5a1mq-5mg", name: "5-Amino-1MQ", size: "5mg", category: "Weight Management", price: 65, batch: "2406-5A5", purity: "99.4%", description: descFor("5-amino-1mq", ""), coa: coa("99.4%", "5.11mg", "YPB.248", "5mg Lyophilized Powder"), coaImage: "/coa/5-Amino-1MQ-(5mg).png", coaUrl: "https://drive.google.com/drive/folders/1K0ZHA4nYQLpW-4-WTNB4sIvry9L9KhE1" },
  { slug: "5a1mq-50mg", name: "5-Amino-1MQ", size: "50mg", category: "Weight Management", price: 229, batch: "2406-5A50", purity: "99.2%", description: descFor("5-amino-1mq", ""), coa: coa("99.2%", "512.4mg", "YPB.223", "50mg Lyophilized Powder"), coaImage: "/coa/5-Amino-1MQ-(50mg).png", coaUrl: "https://drive.google.com/drive/folders/1l6v6-WRE9icMRRhbGm70Prq_je25KfmW" },
  { slug: "aod-9604", name: "AOD-9604", size: "5mg", category: "Weight Management", price: 125, batch: "2406-AOD", purity: "99.2%", description: descFor("aod-9604", ""), coa: coa("99.2%", "5.11mg", "YPB.248", "5mg Lyophilized Powder"), coaImage: "/coa/AOD-9604.png", coaUrl: "https://drive.google.com/drive/folders/1G09CULFkaZmZMT6Buu0xrfbQlAiE8AK7" },
  { slug: "aicar", name: "AICAR", size: "50mg", category: "Weight Management", price: 139, batch: "2406-AIC", purity: "99.5%", description: descFor("aicar", ""), coa: coa("99.5%", "1062.2mg", "YPB.224", "50mg Lyophilized Powder") },
  { slug: "cagrilintide", name: "Cagrilintide", size: "10mg", category: "Weight Management", price: 159, batch: "2406-CAG", purity: "99.9%", description: descFor("cagrilintide", ""), coa: coa("99.9%", "10.69mg", "YPB.241", "10mg Lyophilized Powder"), coaImage: "/coa/Cagrilintide.png", coaUrl: "https://drive.google.com/drive/folders/1CvFT2tV1S4Frvrky-x1LpKuPkPhorWBB" },
  { slug: "mazdutide", name: "Mazdutide", size: "100mg", category: "Weight Management", price: 299, batch: "2406-MAZ", purity: "99.6%", description: descFor("mazdutide", ""), coa: coa("99.6%", "100.42mg", "YPB.269", "100mg Lyophilized Powder"), coaImage: "/coa/Mazdutide.png", coaUrl: "https://drive.google.com/drive/folders/1zzvncjabHn-sEa5hs6aQ2wJZtlJOnqf-" },
  { slug: "survodutide", name: "Survodutide", size: "10mg", category: "Weight Management", price: 279, batch: "2406-SUR", purity: "99.5%", description: descFor("survodutide", ""), coa: coa("99.5%", "10.12mg", "YPB.278", "10mg Lyophilized Powder") },
  { slug: "slu-pp-332", name: "SLU-PP-332", size: "5mg", category: "Weight Management", price: 119, batch: "2406-SLU", purity: "99.1%", description: descFor("slu-pp-332", ""), coa: coa("99.1%", "10.19mg", "YPB.266", "5mg Lyophilized Powder"), coaImage: "/coa/SLU-PP-332.png", coaUrl: "https://drive.google.com/drive/folders/1EEyI7WBdUBEPDkcj4cYMwAHQJ2A8E4s3" },
  { slug: "glp-3-rz", name: "GLP-3 RZ", size: "60mg", category: "Weight Management", price: 249, batch: "2406-GLP3", purity: "99.3%", description: descFor("glp-3-rz", ""), coa: coa("99.3%", "60.11mg", "YPB.296", "60mg Lyophilized Powder") },

  // ── NAD+ ──
  { slug: "nad-500mg", name: "NAD+", size: "500mg", category: "NAD+", price: 229, batch: "2406-NAD500", purity: "99.6%", description: descFor("nad", ""), coa: coa("99.6%", "512.4mg", "YPB.223", "500mg Lyophilized Powder"), coaImage: "/coa/NAD%2B-(500mg).png", coaUrl: "https://drive.google.com/drive/folders/1DeHsZqK6EUZQAjiJIrkr9J4zzRUJo9ry" },
  { slug: "nad-1000mg", name: "NAD+", size: "1000mg", category: "NAD+", price: 329, batch: "2406-NAD1K", purity: "99.5%", description: descFor("nad", ""), coa: coa("99.5%", "1062.2mg", "YPB.224", "1000mg Lyophilized Powder"), coaImage: "/coa/NAD%2B-(1000mg).png", coaUrl: "https://drive.google.com/drive/folders/1017m47lMuxCRX9JCcnG6hz6fzcpY8EbD" },
  { slug: "glutathione-600mg", name: "Glutathione", size: "600mg", category: "NAD+", price: 89, batch: "2406-GLU6", purity: "98.8%", description: descFor("glutathione", ""), coa: coa("98.8%", "604.2mg", "YPB.283", "600mg Lyophilized Powder"), coaImage: "/coa/Glutathione.png", coaUrl: "https://drive.google.com/drive/folders/1zJ-iOa3oXVjjiDidhRfWUfHzIV4oEcFE" },
  { slug: "glutathione-1500mg", name: "Glutathione", size: "1500mg", category: "NAD+", price: 165, batch: "2406-GLU15", purity: "98.5%", description: descFor("glutathione", ""), coa: coa("98.5%", "1505.83mg", "YPB.259", "1500mg Lyophilized Powder"), coaImage: "/coa/Glutathione.png", coaUrl: "https://drive.google.com/drive/folders/1zJ-iOa3oXVjjiDidhRfWUfHzIV4oEcFE" },

  // ── Sexual Health ──
  { slug: "pt-141", name: "PT-141", size: "10mg", category: "Sexual Health", price: 129, batch: "2406-PT14", purity: "99.4%", description: descFor("pt-141", ""), coa: coa("99.4%", "10.06mg", "YPB.274", "10mg Lyophilized Powder") },
  { slug: "kisspeptin", name: "KissPeptin", size: "10mg", category: "Sexual Health", price: 129, batch: "2406-KISS", purity: "99.1%", description: descFor("kisspeptin", ""), coa: coa("99.1%", "10.19mg", "YPB.266", "10mg Lyophilized Powder"), coaImage: "/coa/KissPeptin.png", coaUrl: "https://drive.google.com/drive/folders/1jQRFzkUrD4jQfK7cZwD6Z2WbMQpo98b7" },

  // ── Blends ──
  { slug: "wolverine-5mg", name: "Wolverine Blend", size: "5mg/5mg", category: "Blends", price: 125, batch: "2406-WLV5", purity: "99.7%", description: descFor("wolverine-blend", ""), coa: coa("99.7%", "10.06mg", "YPB.216", "BPC-157 (5mg) / TB500 (5mg)"), coaImage: "/coa/Wolverine-Blend-(5mg5mg).png", coaUrl: "https://drive.google.com/drive/folders/1hfyQ4hNDTcSy974vVKxzLtjXtBamqsHU" },
  { slug: "wolverine-10mg", name: "Wolverine Blend", size: "10mg/10mg", category: "Blends", price: 199, batch: "2406-WLV10", purity: "99.6%", description: descFor("wolverine-blend", ""), coa: coa("99.6%", "20.12mg", "YPB.217", "BPC-157 (10mg) / TB500 (10mg)"), coaImage: "/coa/Wolverine-Blend-(10mg10mg).png", coaUrl: "https://drive.google.com/drive/folders/1mUATcAAmdMYQzR7tv16dvwnYDNLbAlo3" },
  { slug: "glow-blend", name: "GLOW Blend", size: "70mg", category: "Blends", price: 279, batch: "2406-GLOW", purity: "99.4%", description: descFor("glow-blend", ""), coa: coa("99.4%", "70.08mg", "YPB.218", "GHK-Cu (50mg) / BPC-157 (10mg) / TB500 (10mg)"), coaImage: "/coa/GLOW.png", coaUrl: "https://drive.google.com/drive/folders/1bgn9BYPOLEmtsIdG2-MBUN4XvkCaROJF" },
  { slug: "klow-blend", name: "KLOW Blend — GHK-Cu/KPV/BPC-157/TB-500", size: "80mg", category: "Blends", price: 219, batch: "2406-KLOW", purity: "99.3%", description: descFor("klow-blend", ""), coa: coa("99.3%", "80.14mg", "YPB.264", "GHK-Cu (50mg) / KPV (10mg) / BPC-157 (10mg) / TB500 (10mg)"), coaImage: "/coa/KLOW.png", coaUrl: "https://drive.google.com/drive/folders/16olIYPqxzShIcxtwNUIR1cI9_HQhgJie" },
  { slug: "2x-cjc-ipa", name: "Blend CJC/Ipamorelin", size: "5mg/5mg", category: "Blends", price: 105, batch: "2406-CJIP", purity: "99.6%", description: descFor("2x-blend-cjc-ipamorelin", ""), coa: coa("99.6%", "10.08mg", "YPB.238", "CJC-1295 Without DAC (5mg) / Ipamorelin (5mg)"), coaImage: "/coa/2X-Blend-CJCIpamorelin.png", coaUrl: "https://drive.google.com/drive/folders/175q_zN_FmHt6b3XuSZGe7oG03g3eRrl9" },
  { slug: "8x-lipo", name: "Blend Lipotropic", size: "196mg", category: "Blends", price: 175, batch: "2406-8LIP", purity: "99.4%", description: descFor("8x-lipo", ""), coa: coa("99.4%", "196mg", "YPB.267", "L-Carnitine / L-Arginine / Methionine / Inositol / Choline / B6 / B5 / B12"), coaImage: "/coa/8X-Blend.png", coaUrl: "https://drive.google.com/drive/folders/1op2f32kZM70UWI10lgg4s7hiPPRx4-mB" },
  { slug: "4x-mic", name: "Blend MIC", size: "120mg", category: "Blends", price: 195, batch: "2406-4MIC", purity: "99.5%", description: descFor("4x-mic", ""), coa: coa("99.5%", "120mg", "YPB.268", "Methionine / Choline Chloride / Carnitine / Dexpanthenol"), coaImage: "/coa/4X-Blend.png", coaUrl: "https://drive.google.com/drive/folders/1nXpoSziuWb8O-cw6IuM-DTnTMTeHKstO" },

  // ── Supplies ──
  { slug: "b12", name: "B12", size: "1ml", category: "Supplies", price: 29, batch: "2406-B12", purity: "99.9%", description: descFor("b12", ""), coa: coa("99.9%", "1ml", "YPB.298", "1ml Injectable Solution"), coaImage: "/coa/B12.png", coaUrl: "https://drive.google.com/file/d/1zuxpQTO-QBfLmed-E1i0_700Ya8oQCDu/preview" },
  { slug: "recon-water-3ml", name: "Reconstitution Water", size: "3ml", category: "Supplies", price: 9, batch: "2406-RW3", purity: "99.9%", description: descFor("recon-water", ""), coa: coa("99.9%", "3ml", "YPB.297", "3ml Sterile Water") },
  { slug: "recon-water-10ml", name: "Reconstitution Water", size: "10ml", category: "Supplies", price: 15, batch: "2406-RW10", purity: "99.8%", description: descFor("recon-water", ""), coa: coa("99.8%", "10ml", "YPB.251", "10ml Sterile Water") },
];

// Backwards-compat export — older code imports `peptides`
export const peptides: Peptide[] = allPeptides;

export const categories = [
  { name: "Recovery & Repair", slug: "Recovery" },
  { name: "Growth Hormone", slug: "Growth Hormone" },
  { name: "Longevity", slug: "Longevity" },
  { name: "Skin & Radiance", slug: "Skin" },
  { name: "Cognitive & Sleep", slug: "Cognitive" },
  { name: "Immune & Thymic", slug: "Immune" },
  { name: "Weight Management", slug: "Weight Management" },
  { name: "NAD+ & Antioxidants", slug: "NAD+" },
  { name: "Sexual Health", slug: "Sexual Health" },
  { name: "Blends & Stacks", slug: "Blends" },
  { name: "Supplies", slug: "Supplies" },
];

const FEATURED_SLUGS = [
  "bpc-157-10mg",
  "tb-500-10mg",
  "epitalon-10mg",
  "mots-c-10mg",
  "ghk-cu-50mg",
  "nad-500mg",
  "klow-blend",
  "wolverine-10mg",
];

export const featuredPeptides: Peptide[] = FEATURED_SLUGS.map(
  (slug) => allPeptides.find((p) => p.slug === slug)!,
).filter(Boolean);

export const COMING_SOON_SLUGS = new Set([
  "aicar",
  "glp-3-rz",
  "hcg",
  "hmg",
  "igf-1-lr3-01mg",
  "igf-1-lr3-1mg",
  "igf-des",
  "recon-water-3ml",
  "recon-water-10ml",
  "ipamorelin",
  "tesamorelin-10mg",
  "tesamorelin-20mg",
  "ara-290",
  "pnc-27",
  "pinealon",
  "thymalin",
  "snap-8",
  "vip10",
  "survodutide",
  "pt-141",
  "na-epitalon",
  "epitalon-50mg",
  "mots-c-40mg",
]);

export function hasCoa(p: Pick<Peptide, "slug" | "coaImage" | "coaUrl">) {
  if (COMING_SOON_SLUGS.has(p.slug)) return false;
  return !!(p.coaImage || p.coaUrl);
}

export type CoaRow = { label: string; value: string };

export function sampleCoa(p: Peptide): CoaRow[] {
  return [
    { label: "HPLC Purity", value: p.purity },
    { label: "Mass Spec ID", value: p.coa.identity },
    { label: "Heavy Metals", value: p.coa.heavyMetals },
    { label: "Microbial Count", value: p.coa.tamc },
    { label: "Endotoxin (LAL)", value: "< 1 EU/mg" },
  ];
}
