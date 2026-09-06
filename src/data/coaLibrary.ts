// AUTO-COMPILED from the supplier certificate library (Purity Analytics verification API),
// refreshed from https://yourpeptidebrand.com/coa-library/. Values are copied verbatim from
// each certificate record — never inferred. Absent measurements are simply not present here
// and must render as "Not reported".

export type CoaAnalyte = {
  name: string;
  component: string | null;
  result: string | null;
  specification: string | null;
  passFail: string | null;
};

export type CoaMethod = { name: string; reference: string | null };

export type CoaRecord = {
  sku: string;
  productName: string;
  batch: string;
  testedAt: string;
  testCategory: string | null;
  artifactId: string;
  verifyUrl: string;
  pdfUrl: string;
  /** Page-by-page renders of the complete certificate document. */
  pages: string[];
  lab: { name: string | null; address: string | null; website: string | null };
  signer: string | null;
  labCertified: boolean;
  signatureIntact: boolean;
  overallDecision: string | null;
  methods: CoaMethod[];
  analytes: CoaAnalyte[];
};

export const coaRecords: CoaRecord[] = [
  {
    "sku": "YPB.211",
    "productName": "Sermorelin 10mg",
    "batch": "20260311L06TA1S10R",
    "testedAt": "2026-08-05",
    "testCategory": null,
    "artifactId": "coa_070fc1fd226591a0bc6ad812e1ea0543",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_070fc1fd226591a0bc6ad812e1ea0543",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_070fc1fd226591a0bc6ad812e1ea0543/pdf",
    "pages": [
      "/coa/2026/ypb-211-p1.jpg",
      "/coa/2026/ypb-211-p2.jpg",
      "/coa/2026/ypb-211-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.18 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "12.94 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.213",
    "productName": "BPC-157 (10mg)",
    "batch": "20260105L04BPCS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_2d51795c1ee92cf80f46e49709bd75df",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_2d51795c1ee92cf80f46e49709bd75df",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_2d51795c1ee92cf80f46e49709bd75df/pdf",
    "pages": [
      "/coa/2026/ypb-213-p1.jpg",
      "/coa/2026/ypb-213-p2.jpg",
      "/coa/2026/ypb-213-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.85 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "8.18 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.214",
    "productName": "TB-500 5mg",
    "batch": "20251201L01TB6S05",
    "testedAt": "2026-03-21",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_f6ca962bd3a096bfdcebe49b48e2b723",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_f6ca962bd3a096bfdcebe49b48e2b723",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_f6ca962bd3a096bfdcebe49b48e2b723/pdf",
    "pages": [
      "/coa/2026/ypb-214-p1.jpg",
      "/coa/2026/ypb-214-p2.jpg",
      "/coa/2026/ypb-214-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "TB-500",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.8 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "TB-500",
        "result": "5.47 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.215",
    "productName": "TB-500 10mg",
    "batch": "20251216L02TB9S10",
    "testedAt": "2026-03-21",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_3d819ec432b84a16d58b3499159c8828",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_3d819ec432b84a16d58b3499159c8828",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_3d819ec432b84a16d58b3499159c8828/pdf",
    "pages": [
      "/coa/2026/ypb-215-p1.jpg",
      "/coa/2026/ypb-215-p2.jpg",
      "/coa/2026/ypb-215-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "TB-500",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.8 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "TB-500",
        "result": "10.16 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.216",
    "productName": "Wolverine 5/5 (BPC 5 + TB 5)",
    "batch": "20260327L0USBBS10",
    "testedAt": "2026-08-05",
    "testCategory": null,
    "artifactId": "coa_db8ecc2e237dd40699940292b3d967e7",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_db8ecc2e237dd40699940292b3d967e7",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_db8ecc2e237dd40699940292b3d967e7/pdf",
    "pages": [
      "/coa/2026/ypb-216-p1.jpg",
      "/coa/2026/ypb-216-p2.jpg",
      "/coa/2026/ypb-216-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.63 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 BPC-157",
        "component": null,
        "result": "5.81 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 Thymosin Beta-4",
        "component": null,
        "result": "4.92 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.217",
    "productName": "BPC 10mg + TB 10mg (Wolverine 10/10)",
    "batch": "20260412L0US6S20",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_55fc08d542a0ab8ea545979a107519c1",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_55fc08d542a0ab8ea545979a107519c1",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_55fc08d542a0ab8ea545979a107519c1/pdf",
    "pages": [
      "/coa/2026/ypb-217-p1.jpg",
      "/coa/2026/ypb-217-p2.jpg",
      "/coa/2026/ypb-217-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.93 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content \u2014 BPC-157",
        "component": null,
        "result": "12.16 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 Thymosin Beta-4",
        "component": null,
        "result": "11.58 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.218",
    "productName": "GLOW 70mg",
    "batch": "20260126L03G01S70",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_719da69e8213f35c182860fb4ef4750d",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_719da69e8213f35c182860fb4ef4750d",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_719da69e8213f35c182860fb4ef4750d/pdf",
    "pages": [
      "/coa/2026/ypb-218-p1.jpg",
      "/coa/2026/ypb-218-p2.jpg",
      "/coa/2026/ypb-218-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.78 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 GHK-Cu",
        "component": null,
        "result": "47.70 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 BPC-157",
        "component": null,
        "result": "11.43 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 Thymosin Beta-4",
        "component": null,
        "result": "11.37 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.219",
    "productName": "CJC-1295 Without DAC (10mg)",
    "batch": "20260118L01CNDS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_ecba62dd44ad181522df94e45824f6bb",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_ecba62dd44ad181522df94e45824f6bb",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_ecba62dd44ad181522df94e45824f6bb/pdf",
    "pages": [
      "/coa/2026/ypb-219-p1.jpg",
      "/coa/2026/ypb-219-p2.jpg",
      "/coa/2026/ypb-219-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.75 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.79 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.221",
    "productName": "GHK-Cu",
    "batch": "CU50202028",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_eb193821a11c3150d7faba36756f0101",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_eb193821a11c3150d7faba36756f0101",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_eb193821a11c3150d7faba36756f0101/pdf",
    "pages": [
      "/coa/2026/ypb-221-p1.jpg",
      "/coa/2026/ypb-221-p2.jpg",
      "/coa/2026/ypb-221-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "GHK-Cu",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "GHK-Cu",
        "result": "57.61 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<100 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.222",
    "productName": "GHK-Cu 100mg",
    "batch": "20251212L06CUS100",
    "testedAt": "2026-03-21",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_cbf765572a53dea71ab54b55d3dc6b88",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_cbf765572a53dea71ab54b55d3dc6b88",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_cbf765572a53dea71ab54b55d3dc6b88/pdf",
    "pages": [
      "/coa/2026/ypb-222-p1.jpg",
      "/coa/2026/ypb-222-p2.jpg",
      "/coa/2026/ypb-222-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "GHK-Cu",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.5 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "GHK-Cu",
        "result": "110.97 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<150 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.223",
    "productName": "NAD+",
    "batch": "NA500202028",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_b1ff9222a8e40c8baa8bf492a6a7772a",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_b1ff9222a8e40c8baa8bf492a6a7772a",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_b1ff9222a8e40c8baa8bf492a6a7772a/pdf",
    "pages": [
      "/coa/2026/ypb-223-p1.jpg",
      "/coa/2026/ypb-223-p2.jpg",
      "/coa/2026/ypb-223-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "b-NAD+",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.5 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "b-NAD+",
        "result": "553.66 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.224",
    "productName": "NAD+ 1000mg",
    "batch": "20260606L0US1000",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_3667f615a8d166975919e37aeb87cbd7",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_3667f615a8d166975919e37aeb87cbd7",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_3667f615a8d166975919e37aeb87cbd7/pdf",
    "pages": [
      "/coa/2026/ypb-224-p1.jpg",
      "/coa/2026/ypb-224-p2.jpg",
      "/coa/2026/ypb-224-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.97 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "1081.40 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.225",
    "productName": "Reconstitution Solution",
    "batch": "20251219L0BA3S03",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_35ed007e903cba281d0bd3e4cc0a1db1",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_35ed007e903cba281d0bd3e4cc0a1db1",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_35ed007e903cba281d0bd3e4cc0a1db1/pdf",
    "pages": [
      "/coa/2026/ypb-225-p1.jpg",
      "/coa/2026/ypb-225-p2.jpg",
      "/coa/2026/ypb-225-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "Ultrapure Sterile Water",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.9 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "Ultrapure Sterile Water",
        "result": "N/A",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": null
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.226",
    "productName": "Reconstitution Solution",
    "batch": "20251217L0BA1S10",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_c273d218b48ea3c2d682a8b929f934a1",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_c273d218b48ea3c2d682a8b929f934a1",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_c273d218b48ea3c2d682a8b929f934a1/pdf",
    "pages": [
      "/coa/2026/ypb-226-p1.jpg",
      "/coa/2026/ypb-226-p2.jpg",
      "/coa/2026/ypb-226-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "Ultrapure Sterile Water",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.9 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "Ultrapure Sterile Water",
        "result": "N/A",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": null
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.227",
    "productName": "MOTS-c (10mg)",
    "batch": "20260411L01MTSS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_89bd3212daf08bf37f6d3023728f7074",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_89bd3212daf08bf37f6d3023728f7074",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_89bd3212daf08bf37f6d3023728f7074/pdf",
    "pages": [
      "/coa/2026/ypb-227-p1.jpg",
      "/coa/2026/ypb-227-p2.jpg",
      "/coa/2026/ypb-227-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.45 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "12.85 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.228",
    "productName": "Selank (10mg)",
    "batch": "20260405L0HF2SKS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_1809d89a0f038ea61247b08811d030cf",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_1809d89a0f038ea61247b08811d030cf",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_1809d89a0f038ea61247b08811d030cf/pdf",
    "pages": [
      "/coa/2026/ypb-228-p1.jpg",
      "/coa/2026/ypb-228-p2.jpg",
      "/coa/2026/ypb-228-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.77 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "9.50 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.229",
    "productName": "Semax (10mg)",
    "batch": "20260326L0HDXAS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_d470b036171982824574a049201c186e",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_d470b036171982824574a049201c186e",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_d470b036171982824574a049201c186e/pdf",
    "pages": [
      "/coa/2026/ypb-229-p1.jpg",
      "/coa/2026/ypb-229-p2.jpg",
      "/coa/2026/ypb-229-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.68 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.49 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.230",
    "productName": "DSIP 15mg",
    "batch": "20260108L06DSIS15",
    "testedAt": "2026-04-14",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_fee452efb268bf27aa3b042c75203a9f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_fee452efb268bf27aa3b042c75203a9f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_fee452efb268bf27aa3b042c75203a9f/pdf",
    "pages": [
      "/coa/2026/ypb-230-p1.jpg",
      "/coa/2026/ypb-230-p2.jpg",
      "/coa/2026/ypb-230-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "DSIP",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.2 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "DSIP",
        "result": "17.74 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.231",
    "productName": "Thymosin Alpha 1 10mg",
    "batch": "20260226L06TA1S10G",
    "testedAt": "2026-08-05",
    "testCategory": null,
    "artifactId": "coa_41d30c0852c82a1144fbf2f5bed5f950",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_41d30c0852c82a1144fbf2f5bed5f950",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_41d30c0852c82a1144fbf2f5bed5f950/pdf",
    "pages": [
      "/coa/2026/ypb-231-p1.jpg",
      "/coa/2026/ypb-231-p2.jpg",
      "/coa/2026/ypb-231-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.83 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.42 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.232",
    "productName": "N-Acetyl Epitalon Amidate 5mg",
    "batch": "20261025L06HT3S10",
    "testedAt": "2026-08-21",
    "testCategory": "identity-purity-net-content-microbial",
    "artifactId": "coa_112db3b27255cf7bf16656e01262c19c",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_112db3b27255cf7bf16656e01262c19c",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_112db3b27255cf7bf16656e01262c19c/pdf",
    "pages": [
      "/coa/2026/ypb-232-p1.jpg",
      "/coa/2026/ypb-232-p2.jpg",
      "/coa/2026/ypb-232-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostics Testing",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [],
    "analytes": []
  },
  {
    "sku": "YPB.237",
    "productName": "BPC-157 20mg",
    "batch": "03262026L0FHDC20",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_5dce07ca14b37b8554b9f2f6c08f42a2",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_5dce07ca14b37b8554b9f2f6c08f42a2",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_5dce07ca14b37b8554b9f2f6c08f42a2/pdf",
    "pages": [
      "/coa/2026/ypb-237-p1.jpg",
      "/coa/2026/ypb-237-p2.jpg",
      "/coa/2026/ypb-237-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.10 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "24.05 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.238",
    "productName": "2X Blend CJC-1295 no DAC 5mg + Ipamorelin 5mg",
    "batch": "20260415L0USCPS10",
    "testedAt": "2026-08-05",
    "testCategory": null,
    "artifactId": "coa_967f52050ebef9c90b3379bb4092cc80",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_967f52050ebef9c90b3379bb4092cc80",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_967f52050ebef9c90b3379bb4092cc80/pdf",
    "pages": [
      "/coa/2026/ypb-238-p1.jpg",
      "/coa/2026/ypb-238-p2.jpg",
      "/coa/2026/ypb-238-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.92 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 Ipamorelin",
        "component": null,
        "result": "7.17 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 CJC-1295",
        "component": null,
        "result": "5.79 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.241",
    "productName": "Cagrilintide 10 mg",
    "batch": "20260306L0USCGS10",
    "testedAt": "2026-08-05",
    "testCategory": "identity-purity-net-content-microbial",
    "artifactId": "coa_7e8e38386956df2e7007eb526ed8d128",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_7e8e38386956df2e7007eb526ed8d128",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_7e8e38386956df2e7007eb526ed8d128/pdf",
    "pages": [
      "/coa/2026/ypb-241-p1.jpg",
      "/coa/2026/ypb-241-p2.jpg",
      "/coa/2026/ypb-241-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostics Testing",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [],
    "analytes": []
  },
  {
    "sku": "YPB.242",
    "productName": "5-amino-1MQ (5mg)",
    "batch": "20260525L0K5AMS05",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_50efb4a70afaf80f359d6b108f9cd398",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_50efb4a70afaf80f359d6b108f9cd398",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_50efb4a70afaf80f359d6b108f9cd398/pdf",
    "pages": [
      "/coa/2026/ypb-242-p1.jpg",
      "/coa/2026/ypb-242-p2.jpg",
      "/coa/2026/ypb-242-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.70 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "5.36 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.244",
    "productName": "LL-37",
    "batch": "LL375202026",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_97c0f31fe33948d18cf9838053012fff",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_97c0f31fe33948d18cf9838053012fff",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_97c0f31fe33948d18cf9838053012fff/pdf",
    "pages": [
      "/coa/2026/ypb-244-p1.jpg",
      "/coa/2026/ypb-244-p2.jpg",
      "/coa/2026/ypb-244-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "LL-37",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.8 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "LL-37",
        "result": "5.79 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<50 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.245",
    "productName": "SS31 10mg",
    "batch": "20260122L04S31S10",
    "testedAt": "2026-04-14",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_f1e8f9a984e1c09d39756b7525572798",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_f1e8f9a984e1c09d39756b7525572798",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_f1e8f9a984e1c09d39756b7525572798/pdf",
    "pages": [
      "/coa/2026/ypb-245-p1.jpg",
      "/coa/2026/ypb-245-p2.jpg",
      "/coa/2026/ypb-245-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "SS31",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "SS31",
        "result": "11.38 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.246",
    "productName": "SS-31",
    "batch": "2S500202028",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_fd8f7b26b4725461dd11fb09cd106b56",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_fd8f7b26b4725461dd11fb09cd106b56",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_fd8f7b26b4725461dd11fb09cd106b56/pdf",
    "pages": [
      "/coa/2026/ypb-246-p1.jpg",
      "/coa/2026/ypb-246-p2.jpg",
      "/coa/2026/ypb-246-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "SS-31",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.3 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "SS-31",
        "result": "52.90 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.247",
    "productName": "5-amino-1MQ 50mg",
    "batch": "20260211L035AMS50",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_4c71c30f2f9f01e43d73d2341e64a431",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_4c71c30f2f9f01e43d73d2341e64a431",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_4c71c30f2f9f01e43d73d2341e64a431/pdf",
    "pages": [
      "/coa/2026/ypb-247-p1.jpg",
      "/coa/2026/ypb-247-p2.jpg",
      "/coa/2026/ypb-247-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.69 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "57.57 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.248",
    "productName": "AOD9604 (5mg)",
    "batch": "20260510L02AODS05",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_6ff4e61d598bf060af11730659163d46",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_6ff4e61d598bf060af11730659163d46",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_6ff4e61d598bf060af11730659163d46/pdf",
    "pages": [
      "/coa/2026/ypb-248-p1.jpg",
      "/coa/2026/ypb-248-p2.jpg",
      "/coa/2026/ypb-248-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.41 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "5.11 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.249",
    "productName": "ACE-031 (1mg)",
    "batch": "20260220L01AE1S01",
    "testedAt": "2026-07-01",
    "testCategory": "identity-purity-net-content-microbial",
    "artifactId": "coa_9c7c60275c478f1627fe68884dda0aac",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_9c7c60275c478f1627fe68884dda0aac",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_9c7c60275c478f1627fe68884dda0aac/pdf",
    "pages": [
      "/coa/2026/ypb-249-p1.jpg",
      "/coa/2026/ypb-249-p2.jpg",
      "/coa/2026/ypb-249-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostics Testing",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [],
    "analytes": []
  },
  {
    "sku": "YPB.250",
    "productName": "AICAR 50mg",
    "batch": "20251223L06ZMPS50",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_2e5bada2b631ff8de1ff053c5264af95",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_2e5bada2b631ff8de1ff053c5264af95",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_2e5bada2b631ff8de1ff053c5264af95/pdf",
    "pages": [
      "/coa/2026/ypb-250-p1.jpg",
      "/coa/2026/ypb-250-p2.jpg",
      "/coa/2026/ypb-250-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "AICAR",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.8 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "AICAR",
        "result": "63.09 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.251",
    "productName": "B12 10mL",
    "batch": "20260510L06B12S10",
    "testedAt": "2026-08-21",
    "testCategory": "identity-purity-net-content-microbial",
    "artifactId": "coa_01a432ffe6f8e49f128b9e49f105489f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_01a432ffe6f8e49f128b9e49f105489f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_01a432ffe6f8e49f128b9e49f105489f/pdf",
    "pages": [
      "/coa/2026/ypb-251-p1.jpg",
      "/coa/2026/ypb-251-p2.jpg",
      "/coa/2026/ypb-251-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostics Testing",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [],
    "analytes": []
  },
  {
    "sku": "YPB.252",
    "productName": "DSIP",
    "batch": "DS5202026",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_23c1d8cf07f7936b2571c492e230f852",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_23c1d8cf07f7936b2571c492e230f852",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_23c1d8cf07f7936b2571c492e230f852/pdf",
    "pages": [
      "/coa/2026/ypb-252-p1.jpg",
      "/coa/2026/ypb-252-p2.jpg",
      "/coa/2026/ypb-252-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "DSIP",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.2 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "DSIP",
        "result": "5.22 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.253",
    "productName": "Epitalon 10mg",
    "batch": "20251205L04ETZS50",
    "testedAt": "2026-03-21",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_fd120d964ef16433ea4f5e18c5928e02",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_fd120d964ef16433ea4f5e18c5928e02",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_fd120d964ef16433ea4f5e18c5928e02/pdf",
    "pages": [
      "/coa/2026/ypb-253-p1.jpg",
      "/coa/2026/ypb-253-p2.jpg",
      "/coa/2026/ypb-253-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "Epitalon",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.3 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Epitalon",
        "result": "12.45 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.254",
    "productName": "Epitalon 50mg",
    "batch": "20251222L06AEDGS50",
    "testedAt": "2026-04-14",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_a171a12c7ac19f2a266a063ccf19bbe8",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_a171a12c7ac19f2a266a063ccf19bbe8",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_a171a12c7ac19f2a266a063ccf19bbe8/pdf",
    "pages": [
      "/coa/2026/ypb-254-p1.jpg",
      "/coa/2026/ypb-254-p2.jpg",
      "/coa/2026/ypb-254-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "Epitalon/Epithalon",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.7 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Epitalon/Epithalon",
        "result": "54.70 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.255",
    "productName": "FOX04-DRI 10mg",
    "batch": "20251220L05F4S10",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_dcc211017dbcd1224c2ea15e40ee5601",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_dcc211017dbcd1224c2ea15e40ee5601",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_dcc211017dbcd1224c2ea15e40ee5601/pdf",
    "pages": [
      "/coa/2026/ypb-255-p1.jpg",
      "/coa/2026/ypb-255-p2.jpg",
      "/coa/2026/ypb-255-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "FOX04-DRI",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.5 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "FOX04-DRI",
        "result": "10.30 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.256",
    "productName": "hCG 10,000iu",
    "batch": "20251206L05GKS10",
    "testedAt": "2026-03-21",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_06eedda71480c8a577d7cf5d44fde49b",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_06eedda71480c8a577d7cf5d44fde49b",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_06eedda71480c8a577d7cf5d44fde49b/pdf",
    "pages": [
      "/coa/2026/ypb-256-p1.jpg",
      "/coa/2026/ypb-256-p2.jpg",
      "/coa/2026/ypb-256-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "Chorionic Gonadotropin",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.7 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.258",
    "productName": "HMG 75iu",
    "batch": "20251218L05HMGS75",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_1008e4edb6926c42c1c16c03e890850e",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_1008e4edb6926c42c1c16c03e890850e",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_1008e4edb6926c42c1c16c03e890850e/pdf",
    "pages": [
      "/coa/2026/ypb-258-p1.jpg",
      "/coa/2026/ypb-258-p2.jpg",
      "/coa/2026/ypb-258-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "hMG",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.259",
    "productName": "Glutathione",
    "batch": "GLU500031828",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_823ba161dd30100cddf101bc7de5cd20",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_823ba161dd30100cddf101bc7de5cd20",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_823ba161dd30100cddf101bc7de5cd20/pdf",
    "pages": [
      "/coa/2026/ypb-259-p1.jpg",
      "/coa/2026/ypb-259-p2.jpg",
      "/coa/2026/ypb-259-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "L-Glutathione (reduced)",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "L-Glutathione (reduced)",
        "result": "1,549.2 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.261",
    "productName": "Hexarelin Acetate 5mg",
    "batch": "20251226L04GHSS05",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_8479118a8b960a2eb0c63723a896819f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_8479118a8b960a2eb0c63723a896819f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_8479118a8b960a2eb0c63723a896819f/pdf",
    "pages": [
      "/coa/2026/ypb-261-p1.jpg",
      "/coa/2026/ypb-261-p2.jpg",
      "/coa/2026/ypb-261-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "Hexarelin Acetate",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Hexarelin Acetate",
        "result": "5.29 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.262",
    "productName": "IGF-1LR3 1mg",
    "batch": "20260512L01IGFS01",
    "testedAt": "2026-08-05",
    "testCategory": null,
    "artifactId": "coa_094cf009719d7bb3a2a7d6e097a661a9",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_094cf009719d7bb3a2a7d6e097a661a9",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_094cf009719d7bb3a2a7d6e097a661a9/pdf",
    "pages": [
      "/coa/2026/ypb-262-p1.jpg",
      "/coa/2026/ypb-262-p2.jpg",
      "/coa/2026/ypb-262-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.07 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "1.46 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.263",
    "productName": "Ipamorelin (10mg)",
    "batch": "20260511L01IPLS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_f44642ebd5bf8fc1b15efc9b7f45f72b",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_f44642ebd5bf8fc1b15efc9b7f45f72b",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_f44642ebd5bf8fc1b15efc9b7f45f72b/pdf",
    "pages": [
      "/coa/2026/ypb-263-p1.jpg",
      "/coa/2026/ypb-263-p2.jpg",
      "/coa/2026/ypb-263-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.69 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.18 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.264",
    "productName": "KLOW 80mg",
    "batch": "20260406L0US4S20",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_02643bff45ee27d396db7b24b897a12f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_02643bff45ee27d396db7b24b897a12f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_02643bff45ee27d396db7b24b897a12f/pdf",
    "pages": [
      "/coa/2026/ypb-264-p1.jpg",
      "/coa/2026/ypb-264-p2.jpg",
      "/coa/2026/ypb-264-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.73 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content \u2014 GHK-Cu",
        "component": null,
        "result": "53.80 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 KPV",
        "component": null,
        "result": "10.26 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 BPC-157",
        "component": null,
        "result": "12.23 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content \u2014 Thymosin Beta-4",
        "component": null,
        "result": "12.36 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.265",
    "productName": "KPV 10mg",
    "batch": "20260504L0US7S10",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_7033bb40493ea90863d19dd6c6f678bb",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_7033bb40493ea90863d19dd6c6f678bb",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_7033bb40493ea90863d19dd6c6f678bb/pdf",
    "pages": [
      "/coa/2026/ypb-265-p1.jpg",
      "/coa/2026/ypb-265-p2.jpg",
      "/coa/2026/ypb-265-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.54 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.78 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.266",
    "productName": "Kisspeptin",
    "batch": "KS10202028",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_448d83190a84aa1ebaca3846be8648d9",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_448d83190a84aa1ebaca3846be8648d9",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_448d83190a84aa1ebaca3846be8648d9/pdf",
    "pages": [
      "/coa/2026/ypb-266-p1.jpg",
      "/coa/2026/ypb-266-p2.jpg",
      "/coa/2026/ypb-266-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "Kisspeptin-10",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.5 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "Kisspeptin-10",
        "result": "10.98 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<20 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.267",
    "productName": "8X Blend 10ml (196mg/ml)",
    "batch": "20251228L06216S10",
    "testedAt": "2026-02-27",
    "testCategory": "Blend Quantitative Assay + Heavy Metals + Microbial",
    "artifactId": "coa_ccad0d631366b000b13bcc4a62c4d61f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_ccad0d631366b000b13bcc4a62c4d61f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_ccad0d631366b000b13bcc4a62c4d61f/pdf",
    "pages": [
      "/coa/2026/ypb-267-p1.jpg",
      "/coa/2026/ypb-267-p2.jpg",
      "/coa/2026/ypb-267-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Quantitative Assay",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Quantitative Assay",
        "component": "Choline Chloride",
        "result": "56.59 mg",
        "specification": "50mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Inositol",
        "result": "53.11 mg",
        "specification": "50mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Methonine",
        "result": "27.05 mg",
        "specification": "25mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Pyridoxine HCl (B6)",
        "result": "27.79 mg",
        "specification": "25mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Carnitine",
        "result": "21.94 mg",
        "specification": "20mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Arginine",
        "result": "20.95 mg",
        "specification": "20mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Ca Pantothenate (B5)",
        "result": "5.43 mg",
        "specification": "5mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Cyanocobalamin (B12)",
        "result": "1.15 mg",
        "specification": "1mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<150 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.268",
    "productName": "4X Blend 10ml (120mg/ml)",
    "batch": "20251222L06120S10",
    "testedAt": "2026-02-27",
    "testCategory": "Blend Quantitative Assay + Heavy Metals + Microbial",
    "artifactId": "coa_e165ed8cef2d5a8a3781c98644305dc9",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_e165ed8cef2d5a8a3781c98644305dc9",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_e165ed8cef2d5a8a3781c98644305dc9/pdf",
    "pages": [
      "/coa/2026/ypb-268-p1.jpg",
      "/coa/2026/ypb-268-p2.jpg",
      "/coa/2026/ypb-268-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Quantitative Assay",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Quantitative Assay",
        "component": "Choline Chloride",
        "result": "53.05 mg",
        "specification": "50mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Carnitine",
        "result": "52.28 mg",
        "specification": "50mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Methionine",
        "result": "15.50 mg",
        "specification": "15mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Dexpanthenol",
        "result": "5.12 mg",
        "specification": "5mg/ml (NLT 90%)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.269",
    "productName": "Mazdutide 100mg",
    "batch": "20260112L02MDTS01",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_a318265882cc850cc83e9ea37d809d67",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_a318265882cc850cc83e9ea37d809d67",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_a318265882cc850cc83e9ea37d809d67/pdf",
    "pages": [
      "/coa/2026/ypb-269-p1.jpg",
      "/coa/2026/ypb-269-p2.jpg",
      "/coa/2026/ypb-269-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "Mazdutide",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.6 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "Mazdutide",
        "result": "105.19 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.270",
    "productName": "Melanotan-2 10mg",
    "batch": "20260102L03MT2S10",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_05f1de619876096a3f885b428ee1e494",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_05f1de619876096a3f885b428ee1e494",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_05f1de619876096a3f885b428ee1e494/pdf",
    "pages": [
      "/coa/2026/ypb-270-p1.jpg",
      "/coa/2026/ypb-270-p2.jpg",
      "/coa/2026/ypb-270-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.90 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "12.36 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.271",
    "productName": "MOTS-c (40mg)",
    "batch": "20260411L01MTSS40",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_79b753182c923a6d7e5a7c8e6c05ac16",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_79b753182c923a6d7e5a7c8e6c05ac16",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_79b753182c923a6d7e5a7c8e6c05ac16/pdf",
    "pages": [
      "/coa/2026/ypb-271-p1.jpg",
      "/coa/2026/ypb-271-p2.jpg",
      "/coa/2026/ypb-271-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.41 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "39.33 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.272",
    "productName": "SNAP-8 10mg",
    "batch": "20251211L03AO3S10",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_90fa3e1f2c87eb5344eb0144808ae2aa",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_90fa3e1f2c87eb5344eb0144808ae2aa",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_90fa3e1f2c87eb5344eb0144808ae2aa/pdf",
    "pages": [
      "/coa/2026/ypb-272-p1.jpg",
      "/coa/2026/ypb-272-p2.jpg",
      "/coa/2026/ypb-272-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "SNAP-8",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.7 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "SNAP-8",
        "result": "10.69 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.273",
    "productName": "Pinealon",
    "batch": "20260103L03EDRS20",
    "testedAt": "2026-05-13",
    "testCategory": null,
    "artifactId": "coa_554ec6d49d1053378644506b79039af3",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_554ec6d49d1053378644506b79039af3",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_554ec6d49d1053378644506b79039af3/pdf",
    "pages": [
      "/coa/2026/ypb-273-p1.jpg",
      "/coa/2026/ypb-273-p2.jpg",
      "/coa/2026/ypb-273-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID",
        "component": "Pinealon",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity (Correlation Coefficient)",
        "component": null,
        "result": "99.6 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay (Beer-Lambert)",
        "component": "Pinealon",
        "result": "25.54 mg",
        "specification": "NLT 95% label claim (mg/vial)",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 100ppb/vial (Pb, Cd, Hg, Ni, Fe, Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU @ 37\u00b0C/48h",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 10 CFU @ 30\u00b0C/48h",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.274",
    "productName": "PT-141 10mg",
    "batch": "20260119L05P41S10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_9fba1f63a9b7551f60d8d19aac0af06f",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_9fba1f63a9b7551f60d8d19aac0af06f",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_9fba1f63a9b7551f60d8d19aac0af06f/pdf",
    "pages": [
      "/coa/2026/ypb-274-p1.jpg",
      "/coa/2026/ypb-274-p2.jpg",
      "/coa/2026/ypb-274-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.86 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "9.35 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.275",
    "productName": "PNC-27 (10mg)",
    "batch": "20260206L0PNS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_c7485eaac51632d05637d8fca080d995",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_c7485eaac51632d05637d8fca080d995",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_c7485eaac51632d05637d8fca080d995/pdf",
    "pages": [
      "/coa/2026/ypb-275-p1.jpg",
      "/coa/2026/ypb-275-p2.jpg",
      "/coa/2026/ypb-275-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.10 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.04 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.277",
    "productName": "ARA-290 10mg",
    "batch": "202606L0US8S10",
    "testedAt": "2026-08-08",
    "testCategory": null,
    "artifactId": "coa_0bec69061a3e190c1dc3fb8a8eae5cf2",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_0bec69061a3e190c1dc3fb8a8eae5cf2",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_0bec69061a3e190c1dc3fb8a8eae5cf2/pdf",
    "pages": [
      "/coa/2026/ypb-277-p1.jpg",
      "/coa/2026/ypb-277-p2.jpg",
      "/coa/2026/ypb-277-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.21 %",
        "specification": "YPB release threshold: NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "12.25 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "Pass",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.279",
    "productName": "Tesamorelin (10mg)",
    "batch": "20260218L0HFTMS10",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_7b8293d70af5ac7e2df772a2a4dfa755",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_7b8293d70af5ac7e2df772a2a4dfa755",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_7b8293d70af5ac7e2df772a2a4dfa755/pdf",
    "pages": [
      "/coa/2026/ypb-279-p1.jpg",
      "/coa/2026/ypb-279-p2.jpg",
      "/coa/2026/ypb-279-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.82 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "10.68 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.280",
    "productName": "Thymalin 10mg",
    "batch": "20260109L04TY9S10",
    "testedAt": "2026-08-21",
    "testCategory": "identity-purity-net-content-microbial",
    "artifactId": "coa_3775c4c0ea2ac5f26f70079de54c6150",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_3775c4c0ea2ac5f26f70079de54c6150",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_3775c4c0ea2ac5f26f70079de54c6150/pdf",
    "pages": [
      "/coa/2026/ypb-280-p1.jpg",
      "/coa/2026/ypb-280-p2.jpg",
      "/coa/2026/ypb-280-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostics Testing",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [],
    "analytes": []
  },
  {
    "sku": "YPB.281",
    "productName": "VIP(10-28) 10mg",
    "batch": "20260118L04VIPS10",
    "testedAt": "2026-04-14",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_64f6c25a3e8da60093ce7d57c12df825",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_64f6c25a3e8da60093ce7d57c12df825",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_64f6c25a3e8da60093ce7d57c12df825/pdf",
    "pages": [
      "/coa/2026/ypb-281-p1.jpg",
      "/coa/2026/ypb-281-p2.jpg",
      "/coa/2026/ypb-281-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "VIP",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.5 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "VIP",
        "result": "10.41 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.283",
    "productName": "Glutathione 600mg",
    "batch": "25110602",
    "testedAt": "2026-04-14",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_7a14cde23e24d3a825663e007d6d0e6a",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_7a14cde23e24d3a825663e007d6d0e6a",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_7a14cde23e24d3a825663e007d6d0e6a/pdf",
    "pages": [
      "/coa/2026/ypb-283-p1.jpg",
      "/coa/2026/ypb-283-p2.jpg",
      "/coa/2026/ypb-283-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "L-Glutathione",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "L-Glutathione",
        "result": "654.96 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.285",
    "productName": "IGF-1 LR3 0.1mg",
    "batch": "20260112L01IGFS02",
    "testedAt": "2026-02-27",
    "testCategory": "Identity + Purity + Assay + Heavy Metals + Microbial",
    "artifactId": "coa_21d6db7cbd914128d60e08676da4b296",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_21d6db7cbd914128d60e08676da4b296",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_21d6db7cbd914128d60e08676da4b296/pdf",
    "pages": [
      "/coa/2026/ypb-285-p1.jpg",
      "/coa/2026/ypb-285-p2.jpg",
      "/coa/2026/ypb-285-p3.jpg"
    ],
    "lab": {
      "name": "Analytical Formulations, Inc.",
      "address": "8940 Fourwinds Drive STE 107, Windcrest, TX 78239",
      "website": "https://analyticalformulations.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": "pass",
    "methods": [
      {
        "name": "Qualitative ID - Lambda Max",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Percent Purity - Correlation Coefficient",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Quantitative Assay - Beer-Lambert",
        "reference": "Jenway 6715 UV/Vis Spectrophotometer"
      },
      {
        "name": "Heavy Metals - Total Quantity",
        "reference": null
      },
      {
        "name": "TAMC (Total Aerobic Microbial Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      },
      {
        "name": "TYMC (Total Yeast and Mold Counts)",
        "reference": "Substances for Pharmaceutical Use compendium"
      }
    ],
    "analytes": [
      {
        "name": "Qualitative ID (Lambda Max)",
        "component": "IGF-1 LR3",
        "result": "Matches",
        "specification": "TS \u03bbmax is a match compared to its characteristic reference standard.",
        "passFail": "pass"
      },
      {
        "name": "Percent Purity",
        "component": null,
        "result": "99.4 %",
        "specification": "NLT 98%",
        "passFail": "pass"
      },
      {
        "name": "Quantitative Assay",
        "component": "IGF-1 LR3",
        "result": "0.118 mg",
        "specification": "NLT 95% label claim",
        "passFail": "pass"
      },
      {
        "name": "Heavy Metals (Total Quantity)",
        "component": null,
        "result": "<10 ppb",
        "specification": "NMT 150 ppb/vial (including Pb, Cd, Hg, Ni, Fe & Co)",
        "passFail": "pass"
      },
      {
        "name": "TAMC (Aerobic/Coliform)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 1,000 CFU \u00b7 Incubated 48 hrs @ 37\u00b0C",
        "passFail": "pass"
      },
      {
        "name": "TYMC (Yeast & Molds)",
        "component": null,
        "result": "0 CFU",
        "specification": "NMT 100 CFU \u00b7 Incubated 48 hrs @ 30\u00b0C",
        "passFail": "pass"
      }
    ]
  },
  {
    "sku": "YPB.288",
    "productName": "Tesamorelin (20mg)",
    "batch": "20260109L01TSMS20",
    "testedAt": "2026-07-01",
    "testCategory": null,
    "artifactId": "coa_9d1ed142b3b3c9fc8b9ca85d1b0002d0",
    "verifyUrl": "https://verify.purityanalytics.com/coa/coa_9d1ed142b3b3c9fc8b9ca85d1b0002d0",
    "pdfUrl": "https://api.purityanalytics.com/verify/coa/coa_9d1ed142b3b3c9fc8b9ca85d1b0002d0/pdf",
    "pages": [
      "/coa/2026/ypb-288-p1.jpg",
      "/coa/2026/ypb-288-p2.jpg",
      "/coa/2026/ypb-288-p3.jpg"
    ],
    "lab": {
      "name": "Freedom Diagnostic Testing, PLLC",
      "address": "217 S Main St, Hillsboro, IL 62049",
      "website": "https://freedomdiagnosticstesting.com"
    },
    "signer": "Purity Analytics LLC",
    "labCertified": true,
    "signatureIntact": true,
    "overallDecision": null,
    "methods": [
      {
        "name": "Identity (LC-MS)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Purity (HPLC-UV)",
        "reference": "HPLC with UV detection coupled with mass spectrometry (LC-MS)."
      },
      {
        "name": "Microbial Analysis (PCR)",
        "reference": "Microbial detection performed using validated polymerase chain reaction (PCR)-based assay targeting common microbial contaminants."
      }
    ],
    "analytes": [
      {
        "name": "Identity (LC-MS)",
        "component": null,
        "result": "Confirmed",
        "specification": null,
        "passFail": "pass"
      },
      {
        "name": "Purity (HPLC-UV)",
        "component": null,
        "result": "99.84 %",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Net Content",
        "component": null,
        "result": "22.55 mg",
        "specification": null,
        "passFail": null
      },
      {
        "name": "Microbial Analysis (PCR)",
        "component": null,
        "result": "No Detectable Microbial DNA",
        "specification": null,
        "passFail": "pass"
      }
    ]
  }
];

/** Supplier SKUs listed in the current library with no published certificate yet. */
export const pendingSkus: Record<string, string> = {
  "YPB.212": "BPC-157 (5mg)",
  "YPB.220": "CJC-1295 With DAC (5mg)",
  "YPB.233": "GDF-8 (1mg)",
  "YPB.243": "SLU-PP-332 (5mg)",
  "YPB.257": "GHRP-6 Acetate (10mg)",
  "YPB.278": "Survodutide (10mg)",
  "YPB.282": "GHRP-6 Acetate (5mg)",
  "YPB.286": "IGF-DES (0.1mg)",
};

const bySku = new Map(coaRecords.map((r) => [r.sku, r]));

/** Site product slug -> supplier SKU, matched on exact supplier SKU and strength. */
export const slugToSku: Record<string, string> = {
  "sermorelin": "YPB.211",
  "bpc-157-5mg": "YPB.212",
  "bpc-157-10mg": "YPB.213",
  "bpc-157-20mg": "YPB.237",
  "tb-500-5mg": "YPB.214",
  "tb-500-10mg": "YPB.215",
  "bpc-157-tb-500-blend-5mg": "YPB.216",
  "bpc-157-tb-500-blend-10mg": "YPB.217",
  "glow-blend": "YPB.218",
  "cjc-nodac": "YPB.219",
  "cjc-dac": "YPB.220",
  "ghk-cu-50mg": "YPB.221",
  "ghk-cu-100mg": "YPB.222",
  "nad-500mg": "YPB.223",
  "nad-1000mg": "YPB.224",
  "recon-water-3ml": "YPB.225",
  "recon-water-10ml": "YPB.226",
  "mots-c-10mg": "YPB.227",
  "mots-c-40mg": "YPB.271",
  "selank": "YPB.228",
  "semax": "YPB.229",
  "dsip-5mg": "YPB.252",
  "dsip-15mg": "YPB.230",
  "ta-1": "YPB.231",
  "na-epitalon": "YPB.232",
  "gdf-8": "YPB.233",
  "2x-cjc-ipa": "YPB.238",
  "cagrilintide": "YPB.241",
  "5a1mq-5mg": "YPB.242",
  "5a1mq-50mg": "YPB.247",
  "slu-pp-332": "YPB.243",
  "ll-37": "YPB.244",
  "ss-31-10mg": "YPB.245",
  "ss-31-50mg": "YPB.246",
  "aod-9604": "YPB.248",
  "ace-031": "YPB.249",
  "aicar": "YPB.250",
  "b12": "YPB.251",
  "epitalon-10mg": "YPB.253",
  "epitalon-50mg": "YPB.254",
  "foxo4": "YPB.255",
  "hcg": "YPB.256",
  "ghrp-6-10mg": "YPB.257",
  "ghrp-6-5mg": "YPB.282",
  "hmg": "YPB.258",
  "glutathione-1500mg": "YPB.259",
  "glutathione-600mg": "YPB.283",
  "hexarelin": "YPB.261",
  "igf-1-lr3-1mg": "YPB.262",
  "igf-1-lr3-01mg": "YPB.285",
  "igf-des": "YPB.286",
  "ipamorelin": "YPB.263",
  "klow-blend": "YPB.264",
  "kpv-10mg": "YPB.265",
  "kisspeptin": "YPB.266",
  "8x-lipo": "YPB.267",
  "4x-mic": "YPB.268",
  "mazdutide": "YPB.269",
  "melanotan-ii": "YPB.270",
  "snap-8": "YPB.272",
  "pinealon": "YPB.273",
  "pt-141": "YPB.274",
  "pnc-27": "YPB.275",
  "ara-290": "YPB.277",
  "survodutide": "YPB.278",
  "tesamorelin-10mg": "YPB.279",
  "tesamorelin-20mg": "YPB.288",
  "thymalin": "YPB.280",
  "vip10": "YPB.281",
};

export type CoaStatus =
  | { state: "published"; record: CoaRecord }
  | { state: "pending"; sku: string; productName: string }
  | { state: "unavailable" };

export function coaForSku(sku: string | undefined): CoaStatus {
  if (!sku) return { state: "unavailable" };
  const record = bySku.get(sku);
  if (record) return { state: "published", record };
  const productName = pendingSkus[sku];
  if (productName) return { state: "pending", sku, productName };
  return { state: "unavailable" };
}

export function coaForSlug(slug: string | undefined): CoaStatus {
  if (!slug) return { state: "unavailable" };
  return coaForSku(slugToSku[slug]);
}

const NOT_REPORTED = "Not reported";

/** Verbatim analyte result, or "Not reported" when the certificate omits it. */
export function analyteResult(record: CoaRecord, matcher: RegExp): string {
  const hit = record.analytes.find((a) => matcher.test(a.name));
  return hit?.result?.trim() || NOT_REPORTED;
}

export function purityOf(record: CoaRecord): string {
  return analyteResult(record, /purity/i);
}

export function formatTestedAt(iso: string): string {
  if (!iso) return NOT_REPORTED;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export { NOT_REPORTED };
