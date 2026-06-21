export type CoaData = {
  purity: string;
  assay: string;
  identity: "Confirmed";
  heavyMetals: string;
  tamc: string;
  tymc: string;
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
  /** COA card should render in "image pending" state — list it in the library but disable the certificate viewer. */
  coaPending?: boolean;
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
    "Pentadecapeptide derived from gastric juice protein BPC. Researched for connective-tissue repair, angiogenesis, and gut-barrier integrity.",
  "tb-500":
    "Synthetic Thymosin β4 fragment. Researched for actin sequestration, tissue repair, and inflammation modulation.",
  "wolverine-blend":
    "Pure recovery dual stack. Each vial contains BPC-157 and TB-500 in matched doses (5mg/5mg or 10mg/10mg depending on size selected) — researched for connective tissue repair and inflammation modulation.",
  "ll-37":
    "Human cathelicidin antimicrobial peptide. Researched for innate immune defense, wound healing, and biofilm disruption.",
  "ara-290":
    "ARA-290 is a peptide analog of Erythropoietin engineered to selectively activate the innate repair receptor without triggering erythropoietic effects. Research has explored its role in neuroprotection, anti-inflammatory signaling, and tissue repair mechanisms in animal and human studies.",
  "pnc-27":
    "PNC-27 is a peptide containing a p53-derived sequence linked to a membrane-residing peptide. It has been studied in cancer research models for its interaction with cellular membranes and selective cytotoxicity in tumor cell lines.",
  sermorelin:
    "GHRH (1–29) analog. Researched for endogenous GH secretion at the hypothalamic-pituitary level.",
  "cjc-1295-without-dac":
    "Mod GRF (1-29) — GHRH analog with no DAC. Researched for pulsatile GH release on a short (~30 min) half-life, often stacked with Ipamorelin.",
  "cjc-1295-with-dac":
    "GHRH analog with Drug Affinity Complex extending half-life to ~8 days. Researched for sustained GH pulse amplification.",
  "2x-blend-cjc-ipamorelin":
    "A balanced growth hormone secretagogue stack. Each vial contains CJC-1295 (no DAC) 5mg and Ipamorelin 5mg — researched together for amplified GH pulse without DAC's extended half-life.",
  ipamorelin:
    "Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor agonist widely regarded as one of the cleanest GH-releasing peptides studied, noted for stimulating GH release without significantly elevating cortisol, prolactin, or ACTH in animal models.",
  tesamorelin:
    "Tesamorelin is an FDA-approved GHRH analog sold under the brand name Egrifta, with extensive Phase III trial data covering its effects on visceral fat, IGF-1 levels, and metabolic parameters.",
  "ghrp-6-acetate":
    "Growth hormone releasing peptide. Researched for GH secretion via ghrelin receptor activation and appetite signaling.",
  "hexarelin-acetate":
    "Synthetic GHRP. Researched for potent GH release via ghrelin receptor and reported cardioprotective signaling.",
  hcg: "Human Chorionic Gonadotropin is a glycoprotein hormone that acts as a functional analog of Luteinizing Hormone, binding to LH receptors. Studied in Leydig cell stimulation, testosterone biosynthesis signaling, and HPG-axis research in animal models.",
  hmg: "Human Menopausal Gonadotropin is a preparation containing follicle-stimulating and luteinizing hormone activity, used as a reference compound in reproductive endocrinology research.",
  "igf-1-lr3":
    "IGF-1 LR3 is a modified analog of Insulin-like Growth Factor 1, engineered with an arginine substitution and 13-amino acid N-terminal extension that dramatically extends its half-life. Studied in muscle cell proliferation, satellite cell activation, and downstream mTOR/PI3K signaling.",
  "igf-des":
    "IGF-DES is a truncated form of IGF-1 lacking the first three N-terminal amino acids. Research has explored its localized signaling activity and rapid clearance profile.",
  "gdf-8":
    "Polyclonal antibody targeting myostatin (GDF-8). Researched for skeletal muscle mass studies via myostatin pathway inhibition.",
  "ace-031":
    "Soluble activin receptor type IIB fusion protein. Researched as a myostatin/activin pathway antagonist for muscle mass and bone density studies.",
  "n-acetyl-epitalon-amidate":
    "The acetylated and amidated form of Epitalon, engineered for enhanced molecular stability in research settings. Carries the same extensively published research profile as Epitalon — telomerase activity, pineal function, aging-pathway research — with improved structural durability.",
  epitalon:
    "Tetrapeptide (Ala-Glu-Asp-Gly) derived from the pineal gland. Researched for telomerase activation and circadian rhythm regulation.",
  "mots-c":
    "Mitochondrial-derived peptide (16 aa) encoded in mt-12S rRNA. Researched for AMPK activation, glucose metabolism, and exercise mimetic effects.",
  "ss-31":
    "Mitochondria-targeted tetrapeptide. Researched for cardiolipin stabilization, ROS reduction, and mitochondrial bioenergetics.",
  foxo4:
    "D-retro-inverso FOXO4 peptide. Researched as a senolytic — selectively triggering apoptosis in senescent cells via p53 disruption.",
  pinealon:
    "Pinealon is a tripeptide developed alongside Epitalon in Professor Khavinson's bioregulatory peptide research program. Studies have investigated its interactions with the central nervous system and neuroendocrine centers.",
  thymalin:
    "Thymalin is a polypeptide extract derived from the thymus gland, with decades of published research primarily from Russian and Eastern European institutions exploring immune modulation, thymic function, and aging-related immune decline.",
  "ghk-cu":
    "Copper tripeptide (Glycyl-L-Histidyl-L-Lysine-Cu). Researched for wound healing, collagen synthesis, antioxidant signaling, and gene-expression modulation.",
  "glow-blend":
    "Skin + recovery stack. Each vial contains GHK-Cu 50mg, BPC-157 10mg, and TB-500 10mg — researched for dermal repair, collagen induction, and systemic tissue recovery.",
  "klow-blend":
    "Tissue repair + skin radiance stack. Each vial contains GHK-Cu 50mg, BPC-157 10mg, TB-500 10mg, and KPV 10mg — researched for accelerated repair, collagen synthesis, and anti-inflammatory pathways.",
  "snap-8":
    "Snap-8 is a synthetic octapeptide analog of Argireline studied for effects on the SNARE protein complex — the molecular machinery responsible for neurotransmitter release at the neuromuscular junction.",
  "melanotan-2":
    "Cyclic α-MSH analog. Researched for melanogenesis, libido signaling, and appetite suppression via melanocortin receptors.",
  semax:
    "Synthetic ACTH (4–10) analog. Researched for cognitive enhancement, BDNF/NGF expression, and neuroprotection.",
  selank:
    "Synthetic heptapeptide based on tuftsin. Researched for anxiolytic effects, BDNF expression, and immunomodulation.",
  dsip:
    "Delta sleep-inducing peptide. Researched for slow-wave sleep modulation, HPA-axis regulation, and circadian rhythm response.",
  "thymosin-alpha-1":
    "28-amino-acid peptide derived from prothymosin alpha. Researched for T-cell maturation, immune modulation, and antiviral response.",
  vip10:
    "Vasoactive Intestinal Peptide (VIP) is a 28-amino acid neuropeptide found throughout the central and peripheral nervous systems. Studied for vasodilatory effects, immunomodulatory properties, and circadian rhythm regulation.",
  "5-amino-1mq":
    "NNMT inhibitor researched for metabolic regulation. Studied for its role in NAD+ salvage, methyl-group cycling, and adipose-tissue energy expenditure.",
  "aod-9604":
    "C-terminal fragment of human growth hormone (residues 177–191). Researched for adipose tissue lipolysis without the metabolic effects of full-length hGH.",
  aicar:
    "AICAR is an AMPK activator extensively studied as an exercise mimetic compound. Animal research has explored effects on endurance capacity, mitochondrial biogenesis, fat oxidation, and glucose uptake.",
  cagrilintide:
    "Long-acting amylin analog. Researched for satiety signaling and appetite modulation, often paired with GLP-1 receptor agonists in metabolic studies.",
  mazdutide:
    "Dual GLP-1 / glucagon receptor agonist. Researched for metabolic regulation, energy expenditure, and weight modulation.",
  survodutide:
    "Survodutide is a dual GLP-1 and glucagon receptor agonist in active clinical research, studied in metabolic and weight-management contexts.",
  "slu-pp-332":
    "Selective ERR (estrogen-related receptor) agonist. Researched as an exercise mimetic for mitochondrial biogenesis and fat oxidation.",
  "glp-1-s":
    "GLP-1 S is a research-grade GLP-1 receptor agonist analog studied in metabolic and weight-management models. Research has explored its effects on glycemic control, gastric emptying, and appetite-regulation pathways.",
  "glp-2-tz":
    "GLP-2 TZ is a research analog in the GLP family studied in metabolic and body-composition research models, with focus on receptor signaling and incretin pathway activity.",
  "glp-3-rt":
    "GLP-3 RT is a research peptide in the GLP family currently being explored in metabolic and weight-management research models, studied for receptor activity and downstream metabolic signaling.",
  "cagri-glp1-blend":
    "A research blend pairing Cagrilintide (a long-acting amylin analog) with GLP-1 S. The combination has attracted research attention for synergistic effects on appetite regulation, gastric emptying, and metabolic signaling in animal models.",
  nad: "β-Nicotinamide adenine dinucleotide. Central redox cofactor researched for mitochondrial function, sirtuin activity, and cellular energy metabolism.",
  glutathione:
    "Reduced L-Glutathione. Master antioxidant researched for oxidative stress response, hepatic detoxification, and cellular redox balance.",
  "pt-141":
    "PT-141, known pharmaceutically as Bremelanotide, is an FDA-approved melanocortin receptor agonist. Research has explored its activation of MC3R and MC4R receptors and central nervous system role in arousal-pathway research.",
  kisspeptin:
    "Endogenous neuropeptide and KISS1R agonist. Researched for HPG-axis modulation, LH/FSH pulsatility, and reproductive endocrinology.",
  kpv:
    "C-terminal tripeptide of α-MSH. Researched for anti-inflammatory signaling via melanocortin pathways, particularly in gut and skin models.",
  "8x-lipo":
    "Extended lipotropic + B-complex stack. Each 10ml vial contains Choline 50mg/ml, Inositol 50mg/ml, L-Methionine 25mg/ml, Pyridoxine B6 25mg/ml, L-Carnitine 20mg/ml, L-Arginine 20mg/ml, Ca Pantothenate B5 5mg/ml, and Cyanocobalamin B12 1mg/ml.",
  "4x-mic":
    "Classic lipotropic injection stack. Each 10ml vial contains Choline 50mg/ml, L-Carnitine 50mg/ml, L-Methionine 15mg/ml, and Dexpanthenol (B5) 5mg/ml — researched for hepatic fat metabolism and energy substrate transport.",
  b12:
    "Methylcobalamin / cyanocobalamin. Reference cofactor researched for methylation cycles, neural support, and energy metabolism.",
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
  { slug: "ll-37", name: "LL-37", size: "5mg", category: "Recovery", price: 129, batch: "2406-LL37", purity: "99.5%", description: descFor("ll-37", ""), coa: coa("99.5%", "5.02mg", "YPB.244", "5mg Lyophilized Powder"), coaImage: "/coa/LL37.png", coaUrl: "https://drive.google.com/drive/folders/17d8N9cUiIPZpqMwM2RsQg1V_ZyGA6xck" },
  { slug: "ara-290", name: "ARA-290", size: "10mg", category: "Recovery", price: 159, batch: "2406-ARA", purity: "99.8%", description: descFor("ara-290", ""), coa: coa("99.8%", "9.97mg", "YPB.277", "10mg Lyophilized Powder") },
  { slug: "pnc-27", name: "PNC-27", size: "10mg", category: "Recovery", price: 199, batch: "2406-PNC", purity: "99.1%", description: descFor("pnc-27", ""), coa: coa("99.1%", "10.04mg", "YPB.275", "10mg Lyophilized Powder") },

  // ── Growth Hormone ──
  { slug: "sermorelin", name: "Sermorelin", size: "10mg", category: "Growth Hormone", price: 115, batch: "2406-SER", purity: "99.2%", description: descFor("sermorelin", ""), coa: coa("99.2%", "9.91mg", "YPB.211", "10mg Lyophilized Powder"), coaImage: "/coa/Sermorelin.png", coaUrl: "https://drive.google.com/drive/folders/1XQeNykEKE6KpHV2RDGH5GBRyanziS4_W" },
  { slug: "cjc-nodac", name: "CJC-1295 Without DAC", size: "10mg", category: "Growth Hormone", price: 99, batch: "2406-CJCND", purity: "99.9%", description: descFor("cjc-1295-without-dac", ""), coa: coa("99.9%", "10.16mg", "YPB.219", "10mg Lyophilized Powder"), coaImage: "/coa/CJC-1295-Without-DAC.png", coaUrl: "https://drive.google.com/drive/folders/1jUglWPQNA5I1P4czrEkNAuujNMKxdNZb" },
  { slug: "cjc-dac", name: "CJC-1295 With DAC", size: "5mg", category: "Growth Hormone", price: 109, batch: "2406-CJCD", purity: "99.5%", description: descFor("cjc-1295-with-dac", ""), coa: coa("99.5%", "5.04mg", "YPB.220", "5mg Lyophilized Powder"), coaImage: "/coa/CJC-1295-With-DAC.png", coaUrl: "https://drive.google.com/drive/folders/1jz137QnZeh--fq8syBHLX5Ke0urUYgDF" },
  
  { slug: "ipamorelin", name: "Ipamorelin", size: "10mg", category: "Growth Hormone", price: 129, batch: "2406-IPA", purity: "99.7%", description: descFor("ipamorelin", ""), coa: coa("99.7%", "10.12mg", "YPB.263", "10mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/1dmSoTwRBZscv3zqwxev_Vi6ZciV6t0U_" },
  { slug: "tesamorelin-10mg", name: "Tesamorelin", size: "10mg", category: "Growth Hormone", price: 165, batch: "2406-TES10", purity: "99.3%", description: descFor("tesamorelin", ""), coa: coa("99.3%", "9.98mg", "YPB.279", "10mg Lyophilized Powder") },
  { slug: "tesamorelin-20mg", name: "Tesamorelin", size: "20mg", category: "Growth Hormone", price: 299, batch: "2406-TES20", purity: "99.2%", description: descFor("tesamorelin", ""), coa: coa("99.2%", "20.06mg", "YPB.273", "20mg Lyophilized Powder") },
  { slug: "ghrp-6-5mg", name: "GHRP-6 Acetate", size: "5mg", category: "Growth Hormone", price: 99, batch: "2406-GH65", purity: "99.9%", description: descFor("ghrp-6-acetate", ""), coa: coa("99.9%", "4.99mg", "YPB.282", "5mg Lyophilized Powder"), coaImage: "/coa/GHRP-6-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/14Jp9mA9lOO2vwaRWo3MUw-RiYd4RNH8e" },
  { slug: "ghrp-6-10mg", name: "GHRP-6 Acetate", size: "10mg", category: "Growth Hormone", price: 129, batch: "2406-GH610", purity: "99.6%", description: descFor("ghrp-6-acetate", ""), coa: coa("99.6%", "10.08mg", "YPB.257", "10mg Lyophilized Powder"), coaImage: "/coa/GHRP-6-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/14Jp9mA9lOO2vwaRWo3MUw-RiYd4RNH8e" },
  { slug: "hexarelin", name: "Hexarelin Acetate", size: "5mg", category: "Growth Hormone", price: 139, batch: "2406-HEX", purity: "99.4%", description: descFor("hexarelin-acetate", ""), coa: coa("99.4%", "5.06mg", "YPB.261", "5mg Lyophilized Powder"), coaImage: "/coa/Hexarelin-Acetate.png", coaUrl: "https://drive.google.com/drive/folders/12c8HFS-BCAlz3RVDrDwgFjlVFbMkxTKu" },
  { slug: "hcg", name: "HCG", size: "10000iu", category: "Growth Hormone", price: 189, batch: "YPB.256", purity: "99.7%", description: descFor("hcg", ""), coa: coa("99.7%", "12,481iu", "YPB.256", "10000iu Lyophilized Powder"), coaImage: "/coa/HCG.png", coaUrl: "/coa/HCG.pdf" },
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
  { slug: "mots-c-10mg", name: "MOTS-c", size: "10mg", category: "Longevity", price: 219, batch: "2406-MOT10", purity: "99.6%", description: descFor("mots-c", ""), coa: coa("99.6%", "10.05mg", "YPB.227", "10mg Lyophilized Powder"), coaImage: "/coa/MOTS-c.png", coaUrl: "https://drive.google.com/drive/folders/17tMWs6D6C1_h8ZBndWqB8I5CWbvt8vYC" },
  { slug: "mots-c-40mg", name: "MOTS-c", size: "40mg", category: "Longevity", price: 250, batch: "2406-MOT40", purity: "99.8%", description: descFor("mots-c", ""), coa: coa("99.8%", "39.68mg", "YPB.271", "40mg Lyophilized Powder"), coaUrl: "https://drive.google.com/drive/folders/17tMWs6D6C1_h8ZBndWqB8I5CWbvt8vYC" },
  { slug: "ss-31-10mg", name: "SS-31", size: "10mg", category: "Longevity", price: 139, batch: "2406-SS10", purity: "99.4%", description: descFor("ss-31", ""), coa: coa("99.4%", "10.11mg", "YPB.294", "10mg Lyophilized Powder"), coaImage: "/coa/SS-31-(10mg).png", coaUrl: "https://drive.google.com/drive/folders/1QYjXK43cip4YTsHj3J3gNifS9kg4GvfS" },
  { slug: "ss-31-50mg", name: "SS-31", size: "50mg", category: "Longevity", price: 279, batch: "2406-SS50", purity: "99.2%", description: descFor("ss-31", ""), coa: coa("99.2%", "50.44mg", "YPB.295", "50mg Lyophilized Powder"), coaImage: "/coa/SS-31-(50mg).png", coaUrl: "https://drive.google.com/drive/folders/1H7d3L5WZsNhcb1tLM9ppGvogoOBCi-7B" },
  { slug: "foxo4", name: "FOXO4", size: "10mg", category: "Longevity", price: 349, batch: "2406-FOXO4", purity: "99.5%", description: descFor("foxo4", ""), coa: { purity: "99.5%", assay: "10.00mg", identity: "Confirmed", heavyMetals: "<10ppb", tamc: "0 CFU", tymc: "0 CFU", sku: "YPB.255", date: D, form: "10mg Lyophilized Powder" }, coaPending: true },
  { slug: "pinealon", name: "Pinealon", size: "20mg", category: "Longevity", price: 135, batch: "2406-PIN", purity: "99.2%", description: descFor("pinealon", ""), coa: coa("99.2%", "20.06mg", "YPB.273", "20mg Lyophilized Powder") },
  { slug: "thymalin", name: "Thymalin", size: "10mg", category: "Longevity", price: 149, batch: "2406-THYM", purity: "99.2%", description: descFor("thymalin", ""), coa: coa("99.2%", "10.08mg", "YPB.280", "10mg Lyophilized Powder") },

  // ── Skin ──
  { slug: "ghk-cu-50mg", name: "GHK-Cu", size: "50mg", category: "Skin", price: 95, batch: "2406-GHK50", purity: "99.3%", description: descFor("ghk-cu", ""), coa: coa("99.3%", "50.22mg", "YPB.221", "50mg Lyophilized Powder"), coaImage: "/coa/GHK-Cu-(50mg).png", coaUrl: "https://drive.google.com/drive/folders/1sSdOORuQnubbJY5sT-hv87MY2WKvZN9J" },
  { slug: "ghk-cu-100mg", name: "GHK-Cu", size: "100mg", category: "Skin", price: 149, batch: "2406-GHK100", purity: "99.1%", description: descFor("ghk-cu", ""), coa: coa("99.1%", "100.5mg", "YPB.222", "100mg Lyophilized Powder"), coaImage: "/coa/GHK-Cu-(100mg).png", coaUrl: "https://drive.google.com/drive/folders/1rQ4mjGwRmR0aIATaMTrOvXC83MlSTLpf" },
  
  { slug: "snap-8", name: "Snap-8", size: "10mg", category: "Skin", price: 115, batch: "2406-SNAP", purity: "99.4%", description: descFor("snap-8", ""), coa: coa("99.4%", "10.11mg", "YPB.272", "10mg Lyophilized Powder") },
  { slug: "melanotan-ii", name: "Melanotan 2", size: "10mg", category: "Skin", price: 115, batch: "2406-MT2", purity: "99.7%", description: descFor("melanotan-2", ""), coa: { purity: "99.7%", assay: "10.00mg", identity: "Confirmed", heavyMetals: "<20ppb", tamc: "0 CFU", tymc: "0 CFU", sku: "YPB.270", date: D, form: "10mg Lyophilized Powder" }, coaPending: true },

  // ── Cognitive ──
  { slug: "semax", name: "Semax", size: "10mg", category: "Cognitive", price: 79, batch: "2406-SEM", purity: "99.2%", description: descFor("semax", ""), coa: coa("99.2%", "10.06mg", "YPB.229", "10mg Lyophilized Powder"), coaImage: "/coa/Semax.png", coaUrl: "https://drive.google.com/drive/folders/1pjHSiPz0Q7-eFy4zA2gYVhNG_gHJLsV9" },
  { slug: "selank", name: "Selank", size: "10mg", category: "Cognitive", price: 79, batch: "2406-SEL", purity: "99.5%", description: descFor("selank", ""), coa: coa("99.5%", "10.04mg", "YPB.228", "10mg Lyophilized Powder"), coaImage: "/coa/Selank.png", coaUrl: "https://drive.google.com/drive/folders/1el17hsIyDWT7BP9VHHLCPhUvsrMqRWFd" },
  { slug: "dsip-5mg", name: "DSIP", size: "5mg", category: "Cognitive", price: 89, batch: "2406-DSIP5", purity: "98.8%", description: descFor("dsip", ""), coa: coa("98.8%", "5.39mg", "YPB.252", "5mg Lyophilized Powder"), coaImage: "/coa/DSIP-(5mg).png", coaUrl: "https://drive.google.com/drive/folders/1nqYFphuA6rFa4dj5sKLwd152P4M7Iye9" },
  { slug: "dsip-15mg", name: "DSIP", size: "15mg", category: "Cognitive", price: 129, batch: "2406-DSIP15", purity: "98.8%", description: descFor("dsip", ""), coa: coa("98.8%", "15.12mg", "YPB.230", "15mg Lyophilized Powder"), coaImage: "/coa/DSIP-(15mg).png", coaUrl: "https://drive.google.com/drive/folders/1LYF_ihZzZkydp70od9G2HTaAiubN4KFV" },

  // ── Immune ──
  { slug: "ta-1", name: "Thymosin Alpha 1", size: "10mg", category: "Immune", price: 139, batch: "2406-TA1", purity: "99.7%", description: descFor("thymosin-alpha-1", ""), coa: coa("99.7%", "10.06mg", "YPB.231", "10mg Lyophilized Powder"), coaImage: "/coa/Thymosin-Alpha-1.png", coaUrl: "https://drive.google.com/drive/folders/1WnbGc1Z7vIaS9dQT4Mq2fIgy9xVQxML4" },
  { slug: "vip10", name: "VIP10", size: "10mg", category: "Immune", price: 199, batch: "2406-VIP", purity: "99.4%", description: descFor("vip10", ""), coa: coa("99.4%", "10.06mg", "YPB.281", "10mg Lyophilized Powder") },
  { slug: "kpv-10mg", name: "KPV", size: "10mg", category: "Immune", price: 119, batch: "2406-KPV", purity: "99.5%", description: descFor("kpv", ""), coa: { purity: "99.5%", assay: "10.00mg", identity: "Confirmed", heavyMetals: "<20ppb", tamc: "0 CFU", tymc: "0 CFU", sku: "YPB.265", date: D, form: "10mg Lyophilized Powder" }, coaPending: true },

  // ── Weight Management ──
  { slug: "5a1mq-5mg", name: "5-Amino-1MQ", size: "5mg", category: "Weight Management", price: 65, batch: "2406-AMN5", purity: "98.5%", description: descFor("5-amino-1mq", ""), coa: { purity: "98.5%", assay: "5.00mg", identity: "Confirmed", heavyMetals: "<10ppb", tamc: "0 CFU", tymc: "0 CFU", sku: "YPB.248", date: D, form: "5mg Lyophilized Powder" }, coaPending: true },
  { slug: "5a1mq-50mg", name: "5-Amino-1MQ", size: "50mg", category: "Weight Management", price: 229, batch: "2406-AMN50", purity: "98.7%", description: descFor("5-amino-1mq", ""), coa: { purity: "98.7%", assay: "50.00mg", identity: "Confirmed", heavyMetals: "<10ppb", tamc: "0 CFU", tymc: "0 CFU", sku: "YPB.223", date: D, form: "50mg Lyophilized Powder" }, coaPending: true },

  { slug: "aod-9604", name: "AOD-9604", size: "5mg", category: "Weight Management", price: 125, batch: "2406-AOD", purity: "99.2%", description: descFor("aod-9604", ""), coa: coa("99.2%", "5.11mg", "YPB.248", "5mg Lyophilized Powder"), coaImage: "/coa/AOD-9604.png", coaUrl: "https://drive.google.com/drive/folders/1G09CULFkaZmZMT6Buu0xrfbQlAiE8AK7" },
  { slug: "aicar", name: "AICAR", size: "50mg", category: "Weight Management", price: 139, batch: "2406-AIC", purity: "99.5%", description: descFor("aicar", ""), coa: coa("99.5%", "1062.2mg", "YPB.224", "50mg Lyophilized Powder") },
  { slug: "cagrilintide", name: "Cagrilintide", size: "10mg", category: "Weight Management", price: 159, batch: "2406-CAG", purity: "99.9%", description: descFor("cagrilintide", ""), coa: coa("99.9%", "10.69mg", "YPB.241", "10mg Lyophilized Powder"), coaImage: "/coa/Cagrilintide.png", coaUrl: "https://drive.google.com/drive/folders/1CvFT2tV1S4Frvrky-x1LpKuPkPhorWBB" },
  { slug: "mazdutide", name: "Mazdutide", size: "100mg", category: "Weight Management", price: 299, batch: "2406-MAZ", purity: "99.6%", description: descFor("mazdutide", ""), coa: coa("99.6%", "100.42mg", "YPB.269", "100mg Lyophilized Powder"), coaImage: "/coa/Mazdutide.png", coaUrl: "https://drive.google.com/drive/folders/1zzvncjabHn-sEa5hs6aQ2wJZtlJOnqf-" },
  { slug: "survodutide", name: "Survodutide", size: "10mg", category: "Weight Management", price: 279, batch: "2406-SUR", purity: "99.5%", description: descFor("survodutide", ""), coa: coa("99.5%", "10.12mg", "YPB.278", "10mg Lyophilized Powder") },
  { slug: "slu-pp-332", name: "SLU-PP-332", size: "5mg", category: "Weight Management", price: 119, batch: "2406-SLU", purity: "99.1%", description: descFor("slu-pp-332", ""), coa: coa("99.1%", "10.19mg", "YPB.266", "5mg Lyophilized Powder"), coaImage: "/coa/SLU-PP-332.png", coaUrl: "https://drive.google.com/drive/folders/1EEyI7WBdUBEPDkcj4cYMwAHQJ2A8E4s3" },
  { slug: "glp-1-s-10mg", name: "GLP-1 S", size: "10mg", category: "Weight Management", price: 149, batch: "2406-G1S10", purity: "99.4%", description: descFor("glp-1-s", ""), coa: coa("99.4%", "10.04mg", "YPB.301", "10mg Lyophilized Powder") },
  { slug: "glp-1-s-20mg", name: "GLP-1 S", size: "20mg", category: "Weight Management", price: 229, batch: "YPB.201", purity: "99.0%", description: descFor("glp-1-s", ""), coa: coa("99.0%", "20.63mg", "YPB.201", "20mg Lyophilized Powder"), coaImage: "/coa/GLP-1-S-(20mg).png", coaUrl: "/coa/GLP-1-S-(20mg).pdf" },
  { slug: "glp-1-s-30mg", name: "GLP-1 S", size: "30mg", category: "Weight Management", price: 299, batch: "YPB.202", purity: "99.7%", description: descFor("glp-1-s", ""), coa: coa("99.7%", "31.23mg", "YPB.202", "30mg Lyophilized Powder"), coaImage: "/coa/GLP-1-S-(30mg).png", coaUrl: "/coa/GLP-1-S-(30mg).pdf" },
  { slug: "glp-2-tz-10mg", name: "GLP-2 TZ", size: "10mg", category: "Weight Management", price: 149, batch: "YPB.203", purity: "99.3%", description: descFor("glp-2-tz", ""), coa: coa("99.3%", "10.01mg", "YPB.203", "10mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(10mg).png", coaUrl: "/coa/GLP-2-TZ-(10mg).pdf" },
  { slug: "glp-2-tz-20mg", name: "GLP-2 TZ", size: "20mg", category: "Weight Management", price: 219, batch: "YPB.204", purity: "99.6%", description: descFor("glp-2-tz", ""), coa: coa("99.6%", "20.06mg", "YPB.204", "20mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(20mg).png", coaUrl: "/coa/GLP-2-TZ-(20mg).pdf" },
  { slug: "glp-2-tz-30mg", name: "GLP-2 TZ", size: "30mg", category: "Weight Management", price: 279, batch: "YPB.205", purity: "99.2%", description: descFor("glp-2-tz", ""), coa: coa("99.2%", "30.22mg", "YPB.205", "30mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(30mg).png", coaUrl: "/coa/GLP-2-TZ-(30mg).pdf" },
  { slug: "glp-2-tz-40mg", name: "GLP-2 TZ", size: "40mg", category: "Weight Management", price: 329, batch: "YPB.206", purity: "99.7%", description: descFor("glp-2-tz", ""), coa: coa("99.7%", "40.56mg", "YPB.206", "40mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(40mg).png", coaUrl: "/coa/GLP-2-TZ-(40mg).pdf" },
  { slug: "glp-2-tz-50mg", name: "GLP-2 TZ", size: "50mg", category: "Weight Management", price: 379, batch: "YPB.207", purity: "99.8%", description: descFor("glp-2-tz", ""), coa: coa("99.8%", "50.47mg", "YPB.207", "50mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(50mg).png", coaUrl: "/coa/GLP-2-TZ-(50mg).pdf" },
  { slug: "glp-2-tz-60mg", name: "GLP-2 TZ", size: "60mg", category: "Weight Management", price: 429, batch: "YPB.208", purity: "99.7%", description: descFor("glp-2-tz", ""), coa: coa("99.7%", "61.94mg", "YPB.208", "60mg Lyophilized Powder"), coaImage: "/coa/GLP-2-TZ-(60mg).png", coaUrl: "/coa/GLP-2-TZ-(60mg).pdf" },
  { slug: "glp-3-rt-10mg", name: "GLP-3 RT", size: "10mg", category: "Weight Management", price: 155, batch: "YPB.209", purity: "99.7%", description: descFor("glp-3-rt", ""), coa: coa("99.7%", "9.94mg", "YPB.209", "10mg Lyophilized Powder"), coaImage: "/coa/GLP-3-RT-(10mg).png", coaUrl: "/coa/GLP-3-RT-(10mg).pdf" },
  { slug: "glp-3-rt-20mg", name: "GLP-3 RT", size: "20mg", category: "Weight Management", price: 229, batch: "YPB.210", purity: "99.3%", description: descFor("glp-3-rt", ""), coa: coa("99.3%", "20.16mg", "YPB.210", "20mg Lyophilized Powder"), coaImage: "/coa/GLP-3-RT-(20mg).png", coaUrl: "/coa/GLP-3-RT-(20mg).pdf" },
  { slug: "glp-3-rt-30mg", name: "GLP-3 RT", size: "30mg", category: "Weight Management", price: 289, batch: "2406-G3R30", purity: "99.5%", description: descFor("glp-3-rt", ""), coa: coa("99.5%", "30.14mg", "YPB.312", "30mg Lyophilized Powder") },
  { slug: "glp-3-rt-40mg", name: "GLP-3 RT", size: "40mg", category: "Weight Management", price: 339, batch: "2406-G3R40", purity: "99.6%", description: descFor("glp-3-rt", ""), coa: coa("99.6%", "40.11mg", "YPB.313", "40mg Lyophilized Powder") },
  { slug: "glp-3-rt-50mg", name: "GLP-3 RT", size: "50mg", category: "Weight Management", price: 389, batch: "2406-G3R50", purity: "99.4%", description: descFor("glp-3-rt", ""), coa: coa("99.4%", "50.18mg", "YPB.314", "50mg Lyophilized Powder") },
  { slug: "glp-3-rt-60mg", name: "GLP-3 RT", size: "60mg", category: "Weight Management", price: 449, batch: "2406-G3R60", purity: "99.6%", description: descFor("glp-3-rt", ""), coa: coa("99.6%", "60.22mg", "YPB.315", "60mg Lyophilized Powder") },

  // ── NAD+ ──
  { slug: "nad-500mg", name: "NAD+", size: "500mg", category: "NAD+", price: 229, batch: "2406-NAD500", purity: "99.6%", description: descFor("nad", ""), coa: coa("99.6%", "512.4mg", "YPB.223", "500mg Lyophilized Powder"), coaImage: "/coa/NAD%2B-(500mg).png", coaUrl: "https://drive.google.com/drive/folders/1DeHsZqK6EUZQAjiJIrkr9J4zzRUJo9ry" },
  { slug: "nad-1000mg", name: "NAD+", size: "1000mg", category: "NAD+", price: 329, batch: "2406-NAD1K", purity: "99.5%", description: descFor("nad", ""), coa: coa("99.5%", "1062.2mg", "YPB.224", "1000mg Lyophilized Powder"), coaImage: "/coa/NAD%2B-(1000mg).png", coaUrl: "https://drive.google.com/drive/folders/1017m47lMuxCRX9JCcnG6hz6fzcpY8EbD" },
  { slug: "glutathione-600mg", name: "Glutathione", size: "600mg", category: "NAD+", price: 89, batch: "2406-GLU6", purity: "98.8%", description: descFor("glutathione", ""), coa: coa("98.8%", "604.2mg", "YPB.283", "600mg Lyophilized Powder"), coaImage: "/coa/Glutathione.png", coaUrl: "https://drive.google.com/drive/folders/1zJ-iOa3oXVjjiDidhRfWUfHzIV4oEcFE" },
  { slug: "glutathione-1500mg", name: "Glutathione", size: "1500mg", category: "NAD+", price: 165, batch: "2406-GLU15", purity: "98.5%", description: descFor("glutathione", ""), coa: coa("98.5%", "1505.83mg", "YPB.259", "1500mg Lyophilized Powder"), coaImage: "/coa/Glutathione.png", coaUrl: "https://drive.google.com/drive/folders/1zJ-iOa3oXVjjiDidhRfWUfHzIV4oEcFE" },

  // ── Sexual Health ──
  { slug: "pt-141", name: "PT-141", size: "10mg", category: "Sexual Health", price: 129, batch: "2406-PT14", purity: "99.4%", description: descFor("pt-141", ""), coa: coa("99.4%", "10.06mg", "YPB.274", "10mg Lyophilized Powder") },
  { slug: "kisspeptin", name: "KissPeptin", size: "10mg", category: "Sexual Health", price: 129, batch: "2406-KISS", purity: "99.1%", description: descFor("kisspeptin", ""), coa: coa("99.1%", "10.19mg", "YPB.266", "10mg Lyophilized Powder"), coaImage: "/coa/KissPeptin.png", coaUrl: "https://drive.google.com/drive/folders/1jQRFzkUrD4jQfK7cZwD6Z2WbMQpo98b7" },

  // ── Blends ──
  { slug: "wolverine-5mg", name: "Wolverine Blend", size: "5mg/5mg", category: "Blends", price: 125, batch: "2406-WLV5", purity: "99.7%", description: descFor("wolverine-blend", ""), coa: coa("99.7%", "10.06mg", "YPB.216", "BPC-157 (5mg) / TB-500 (5mg)"), coaImage: "/coa/Wolverine-Blend-(5mg5mg).png", coaUrl: "https://drive.google.com/drive/folders/1hfyQ4hNDTcSy974vVKxzLtjXtBamqsHU" },
  { slug: "wolverine-10mg", name: "Wolverine Blend", size: "10mg/10mg", category: "Blends", price: 199, batch: "2406-WLV10", purity: "99.6%", description: descFor("wolverine-blend", ""), coa: coa("99.6%", "20.12mg", "YPB.217", "BPC-157 (10mg) / TB-500 (10mg)"), coaImage: "/coa/Wolverine-Blend-(10mg10mg).png", coaUrl: "https://drive.google.com/drive/folders/1mUATcAAmdMYQzR7tv16dvwnYDNLbAlo3" },
  { slug: "glow-blend", name: "GLOW Blend", size: "70mg", category: "Blends", price: 279, batch: "2406-GLOW", purity: "99.4%", description: descFor("glow-blend", ""), coa: coa("99.4%", "70.08mg", "YPB.218", "GHK-Cu (50mg) / BPC-157 (10mg) / TB-500 (10mg)"), coaImage: "/coa/GLOW.png", coaUrl: "https://drive.google.com/drive/folders/1bgn9BYPOLEmtsIdG2-MBUN4XvkCaROJF" },
  { slug: "klow-blend", name: "KLOW Blend", size: "80mg", category: "Blends", price: 299, batch: "2406-KLOW", purity: "PASS", description: descFor("klow-blend", ""), coa: { purity: "PASS", assay: "GHK-Cu (50mg) / BPC-157 (10mg) / TB-500 (10mg) / KPV (10mg)", identity: "Confirmed", heavyMetals: "<15ppb", tamc: "<100 CFU", tymc: "<100 CFU", sku: "YPB.264", date: D, form: "GHK-Cu (50mg) / BPC-157 (10mg) / TB-500 (10mg) / KPV (10mg)" }, coaPending: true },

  
  { slug: "2x-cjc-ipa", name: "Blend CJC/Ipamorelin", size: "5mg/5mg", category: "Blends", price: 105, batch: "2406-CJIP", purity: "99.6%", description: descFor("2x-blend-cjc-ipamorelin", ""), coa: coa("99.6%", "10.08mg", "YPB.238", "CJC-1295 Without DAC (5mg) / Ipamorelin (5mg)"), coaImage: "/coa/2X-Blend-CJCIpamorelin.png", coaUrl: "https://drive.google.com/drive/folders/175q_zN_FmHt6b3XuSZGe7oG03g3eRrl9" },
  { slug: "8x-lipo", name: "Blend Lipotropic", size: "196mg", category: "Blends", price: 175, batch: "2406-8LIP", purity: "99.4%", description: descFor("8x-lipo", ""), coa: coa("99.4%", "196mg", "YPB.267", "L-Carnitine / L-Arginine / Methionine / Inositol / Choline / B6 / B5 / B12"), coaImage: "/coa/8X-Blend.png", coaUrl: "https://drive.google.com/drive/folders/1op2f32kZM70UWI10lgg4s7hiPPRx4-mB" },
  { slug: "4x-mic", name: "Blend MIC", size: "120mg", category: "Blends", price: 195, batch: "2406-4MIC", purity: "99.5%", description: descFor("4x-mic", ""), coa: coa("99.5%", "120mg", "YPB.268", "Methionine / Choline Chloride / Carnitine / Dexpanthenol"), coaImage: "/coa/4X-Blend.png", coaUrl: "https://drive.google.com/drive/folders/1nXpoSziuWb8O-cw6IuM-DTnTMTeHKstO" },
  { slug: "cagri-glp1-25", name: "Cagrilintide / GLP-1 S Blend", size: "2.5mg/2.5mg", category: "Blends", price: 149, batch: "2406-CG25", purity: "99.5%", description: descFor("cagri-glp1-blend", ""), coa: coa("99.5%", "5.04mg", "YPB.316", "Cagrilintide (2.5mg) / GLP-1 S (2.5mg)") },
  { slug: "cagri-glp1-5", name: "Cagrilintide / GLP-1 S Blend", size: "5mg/5mg", category: "Blends", price: 229, batch: "2406-CG5", purity: "99.6%", description: descFor("cagri-glp1-blend", ""), coa: coa("99.6%", "10.08mg", "YPB.317", "Cagrilintide (5mg) / GLP-1 S (5mg)") },

  // ── Supplies ──
  { slug: "b12", name: "B12", size: "10ml", category: "Supplies", price: 49, batch: "2406-B12", purity: "99.9%", description: descFor("b12", ""), coa: coa("99.9%", "10ml", "YPB.298", "10ml Injectable Solution"), coaImage: "/coa/B12.png", coaUrl: "https://drive.google.com/file/d/1zuxpQTO-QBfLmed-E1i0_700Ya8oQCDu/preview" },
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
  "glp-3-rt-10mg",
  "nad-500mg",
  "mots-c-10mg",
  "bpc-157-5mg",
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

export function hasCoa(p: Pick<Peptide, "slug" | "coaImage" | "coaUrl" | "coaPending">) {
  if (COMING_SOON_SLUGS.has(p.slug)) return false;
  return !!(p.coaImage || p.coaUrl || p.coaPending);
}


export type CoaRow = { label: string; value: string };

export function sampleCoa(p: Peptide): CoaRow[] {
  return [
    { label: "Percent Purity", value: p.purity },
    { label: "Identity (λmax)", value: "Match" },
    { label: "Heavy Metals", value: p.coa.heavyMetals },
    { label: "TAMC", value: p.coa.tamc },
    { label: "TYMC", value: p.coa.tymc },
  ];
}
