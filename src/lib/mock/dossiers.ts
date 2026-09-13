// MOCK DATA — stands in for Supabase `formulation_dossier` + the
// Sahayak agent's classifier/obligation-planner/IP-router output.
// Replace with real calls to services/brain once the backend is wired.
import type {
  CultivatorAssessment,
  ExaminerObjection,
  FormulationDossier,
  IPRegimeVerdict,
  ObligationItem,
} from "@/lib/types";

export const dossiers: FormulationDossier[] = [
  {
    id: "dos-001",
    name: "Ashwagandha–Guduchi–Turmeric Immunity Blend",
    dravyaList: ["Withania somnifera", "Tinospora cordifolia", "Curcuma longa"],
    sourcing: "cultivated",
    claimedIndication: "General immunity support",
    targetMarket: ["India", "European Union"],
    classicalTextRef: "Sharangadhara Samhita, Madhyama Khanda 7/40–43",
    jurisdiction: "IN",
    classification: {
      category: "classical_generic",
      confidence: 0.91,
      citation: "AFI Part I, Formulation 112 — matches classical ratio",
    },
    status: "mapped",
    createdAt: "2026-09-02T09:12:00+05:30",
    updatedAt: "2026-09-11T16:40:00+05:30",
    owner: "Formulation owner",
  },
  {
    id: "dos-002",
    name: "Brahmi–Shankhpushpi Cognitive Syrup",
    dravyaList: ["Bacopa monnieri", "Convolvulus pluricaulis"],
    sourcing: "wild_collected",
    claimedIndication: "Memory and concentration support",
    targetMarket: ["India"],
    jurisdiction: "IN",
    classification: {
      category: "patent_or_proprietary",
      confidence: 0.74,
      citation: "Drugs & Cosmetics Act 1940, Rule 158B — proprietary ASU medicine",
    },
    status: "mapped",
    createdAt: "2026-09-04T11:05:00+05:30",
    updatedAt: "2026-09-10T10:22:00+05:30",
    owner: "Formulation owner",
  },
  {
    id: "dos-003",
    name: "Neem–Turmeric Topical Gel",
    dravyaList: ["Azadirachta indica", "Curcuma longa"],
    sourcing: "cultivated",
    claimedIndication: "Skin blemish support (cosmetic)",
    targetMarket: ["India", "United States"],
    jurisdiction: "INTL",
    classification: {
      category: "cosmetic",
      confidence: 0.88,
      citation: "Drugs & Cosmetics Act 1940, Ch. IV — cosmetic classification",
    },
    status: "classified",
    createdAt: "2026-09-06T14:30:00+05:30",
    updatedAt: "2026-09-09T09:00:00+05:30",
    owner: "Formulation owner",
  },
  {
    id: "dos-004",
    name: "Wild Guggul Resin (Cultivator Registration)",
    dravyaList: ["Commiphora wightii"],
    sourcing: "wild_collected",
    claimedIndication: "Raw dravya — no finished formulation yet",
    targetMarket: ["India"],
    jurisdiction: "IN",
    classification: {
      category: "classical_generic",
      confidence: 0.68,
      citation: "Ayurvedic Pharmacopoeia of India, Part I, Vol. II — monograph",
    },
    status: "draft",
    createdAt: "2026-09-08T08:00:00+05:30",
    updatedAt: "2026-09-08T08:00:00+05:30",
    owner: "Cultivator (Rajasthan)",
  },
  {
    id: "dos-005",
    name: "Triphala–Guggul Metabolic Tablet",
    dravyaList: [
      "Terminalia chebula",
      "Terminalia bellirica",
      "Phyllanthus emblica",
      "Commiphora wightii",
    ],
    sourcing: "cultivated",
    claimedIndication: "Metabolic and digestive support",
    targetMarket: ["India", "United States", "European Union"],
    classicalTextRef: "Bhaisajya Ratnavali, Medoroga Chikitsa 8/12",
    jurisdiction: "INTL",
    classification: {
      category: "new_non_classical",
      confidence: 0.62,
      citation: "New Drugs and Clinical Trials Rules 2019 — non-classical ratio",
    },
    status: "under_review",
    createdAt: "2026-09-01T10:00:00+05:30",
    updatedAt: "2026-09-12T18:15:00+05:30",
    owner: "Formulation owner",
  },
];

const baseVerdicts: Record<string, IPRegimeVerdict[]> = {
  "dos-001": [
    { regime: "patent", label: "Patent", verdict: "barred", citation: "Patents Act 1970, Sec 3(e)", note: "Mere admixture of three known dravya; no synergistic data on record." },
    { regime: "trademark", label: "Trade mark", verdict: "open", citation: "Trade Marks Act 1999, Sec 9", note: "Product name is distinctive and not descriptive of the dravya." },
    { regime: "geographical_indication", label: "Geographical indication", verdict: "maybe_open", citation: "GI Act 1999, Sec 2(1)(e)", note: "Open only if sourcing region has documented distinct provenance." },
    { regime: "copyright", label: "Copyright", verdict: "open", citation: "Copyright Act 1957, Sec 13", note: "Label artwork and package copy are original works." },
    { regime: "design", label: "Design", verdict: "open", citation: "Designs Act 2000, Sec 2(d)", note: "Bottle and applicator form can be registered if novel." },
    { regime: "trade_secret", label: "Trade secret", verdict: "open", citation: "Common law — confidentiality", note: "Exact ratio and process are undisclosed and defensible." },
    { regime: "plant_variety", label: "Plant variety", verdict: "barred", citation: "PPV&FR Act 2001, Sec 2(za)", note: "No distinct cultivar developed for any listed dravya." },
  ],
  "dos-002": [
    { regime: "patent", label: "Patent", verdict: "maybe_open", citation: "Patents Act 1970, Sec 3(d)", note: "Novel extraction ratio may show enhanced efficacy — needs comparative data." },
    { regime: "trademark", label: "Trade mark", verdict: "open", citation: "Trade Marks Act 1999, Sec 9", note: "Coined product name, registrable." },
    { regime: "geographical_indication", label: "Geographical indication", verdict: "barred", citation: "GI Act 1999, Sec 2(1)(e)", note: "No claimed regional provenance." },
    { regime: "copyright", label: "Copyright", verdict: "open", citation: "Copyright Act 1957, Sec 13", note: "Packaging literature is an original work." },
    { regime: "design", label: "Design", verdict: "open", citation: "Designs Act 2000, Sec 2(d)", note: "Syrup bottle shape open to registration." },
    { regime: "trade_secret", label: "Trade secret", verdict: "open", citation: "Common law — confidentiality", note: "Extraction process undisclosed." },
    { regime: "plant_variety", label: "Plant variety", verdict: "barred", citation: "PPV&FR Act 2001, Sec 2(za)", note: "No distinct cultivar." },
  ],
  "dos-003": [
    { regime: "patent", label: "Patent", verdict: "barred", citation: "Patents Act 1970, Sec 3(p)", note: "Traditional neem-turmeric skin use is well documented prior art." },
    { regime: "trademark", label: "Trade mark", verdict: "open", citation: "Trade Marks Act 1999, Sec 9", note: "Brand name is distinctive." },
    { regime: "geographical_indication", label: "Geographical indication", verdict: "barred", citation: "GI Act 1999, Sec 2(1)(e)", note: "No regional provenance claimed." },
    { regime: "copyright", label: "Copyright", verdict: "open", citation: "Copyright Act 1957, Sec 13", note: "Packaging copy and artwork original." },
    { regime: "design", label: "Design", verdict: "open", citation: "Designs Act 2000, Sec 2(d)", note: "Tube/jar form open to registration." },
    { regime: "trade_secret", label: "Trade secret", verdict: "open", citation: "Common law — confidentiality", note: "Formulation ratio undisclosed." },
    { regime: "plant_variety", label: "Plant variety", verdict: "barred", citation: "PPV&FR Act 2001, Sec 2(za)", note: "No distinct cultivar." },
  ],
  "dos-004": [
    { regime: "patent", label: "Patent", verdict: "barred", citation: "Patents Act 1970, Sec 3(p)", note: "Raw dravya, not an invention." },
    { regime: "trademark", label: "Trade mark", verdict: "maybe_open", citation: "Trade Marks Act 1999, Sec 9", note: "Open only once sold under a distinctive mark." },
    { regime: "geographical_indication", label: "Geographical indication", verdict: "open", citation: "GI Act 1999, Sec 2(1)(e)", note: "Rajasthan guggul has documented distinct provenance." },
    { regime: "copyright", label: "Copyright", verdict: "barred", citation: "Copyright Act 1957, Sec 13", note: "No original work yet — raw material only." },
    { regime: "design", label: "Design", verdict: "barred", citation: "Designs Act 2000, Sec 2(d)", note: "No product form to register." },
    { regime: "trade_secret", label: "Trade secret", verdict: "barred", citation: "Common law — confidentiality", note: "No proprietary process disclosed." },
    { regime: "plant_variety", label: "Plant variety", verdict: "open", citation: "PPV&FR Act 2001, Sec 2(za)", note: "Eligible if a distinct cultivar is registered." },
  ],
  "dos-005": [
    { regime: "patent", label: "Patent", verdict: "maybe_open", citation: "Patents Act 1970, Sec 3(e)", note: "Non-classical ratio with claimed metabolic effect — needs comparative efficacy data." },
    { regime: "trademark", label: "Trade mark", verdict: "open", citation: "Trade Marks Act 1999, Sec 9", note: "Distinctive coined name." },
    { regime: "geographical_indication", label: "Geographical indication", verdict: "barred", citation: "GI Act 1999, Sec 2(1)(e)", note: "Multi-region sourcing, no single provenance." },
    { regime: "copyright", label: "Copyright", verdict: "open", citation: "Copyright Act 1957, Sec 13", note: "Packaging and literature original." },
    { regime: "design", label: "Design", verdict: "open", citation: "Designs Act 2000, Sec 2(d)", note: "Tablet strip and carton form open." },
    { regime: "trade_secret", label: "Trade secret", verdict: "open", citation: "Common law — confidentiality", note: "Exact ratio undisclosed." },
    { regime: "plant_variety", label: "Plant variety", verdict: "barred", citation: "PPV&FR Act 2001, Sec 2(za)", note: "No distinct cultivar for any listed dravya." },
  ],
};

export const ipVerdictsByDossier = baseVerdicts;

export const obligationsByDossier: Record<string, ObligationItem[]> = {
  "dos-001": [
    { id: "obl-001-1", title: "AYUSH manufacturing licence", description: "Loan-licence or in-house manufacturing licence under Schedule T.", citation: "Drugs & Cosmetics Rules 1945, Sched. T", category: "licence", status: "required" },
    { id: "obl-001-2", title: "ABS clearance not triggered", description: "All three dravya fall under the normally-traded-commodities exemption.", citation: "Biological Diversity Act 2002, Sec 40", category: "abs", status: "not_applicable" },
    { id: "obl-001-3", title: "DMR (OA) Act advertising limits", description: "Immunity claims must avoid disease-cure language.", citation: "Drugs & Magic Remedies Act 1954, Sec 3", category: "advertising", status: "required" },
    { id: "obl-001-4", title: "ASU labelling rules", description: "Ingredient list in Latin binomial + vernacular, batch and licence number.", citation: "Drugs & Cosmetics Rules 1945, Rule 161", category: "labelling", status: "required" },
  ],
  "dos-002": [
    { id: "obl-002-1", title: "Proprietary ASU medicine licence", description: "Licence under Rule 158B with safety and rationale documentation.", citation: "Drugs & Cosmetics Rules 1945, Rule 158B", category: "licence", status: "required" },
    { id: "obl-002-2", title: "ABS clearance — conditional", description: "Bacopa is wild-collected; may trigger state biodiversity board approval.", citation: "Biological Diversity Act 2002, Sec 7", category: "abs", status: "conditional" },
    { id: "obl-002-3", title: "Advertising limits", description: "Cognitive-benefit claims restricted to traditional-use language.", citation: "Drugs & Magic Remedies Act 1954, Sec 3", category: "advertising", status: "required" },
  ],
  "dos-003": [
    { id: "obl-003-1", title: "Cosmetic manufacturing licence", description: "Licence under the Cosmetics Rules, not the ASU drug pathway.", citation: "Drugs & Cosmetics Rules 1945, Ch. IV", category: "licence", status: "required" },
    { id: "obl-003-2", title: "ABS clearance not triggered", description: "Neem and turmeric are normally-traded commodities.", citation: "Biological Diversity Act 2002, Sec 40", category: "abs", status: "not_applicable" },
    { id: "obl-003-3", title: "Cosmetic labelling", description: "INCI-style ingredient declaration required for the US market.", citation: "US FDA 21 CFR 701", category: "labelling", status: "required" },
  ],
  "dos-004": [
    { id: "obl-004-1", title: "State Biodiversity Board intimation", description: "Wild-collected Commiphora wightii requires an ABS Form I filing before commercial sale.", citation: "Biological Diversity Act 2002, Sec 7", category: "abs", status: "required" },
  ],
  "dos-005": [
    { id: "obl-005-1", title: "New-drug clinical pathway", description: "Non-classical ratio requires safety-and-effectiveness data under the phytopharmaceutical route.", citation: "New Drugs and Clinical Trials Rules 2019, Part XA", category: "licence", status: "required" },
    { id: "obl-005-2", title: "FSSAI Ayurveda Aahar review", description: "If marketed as a food supplement rather than a drug, file under the Aahar route instead.", citation: "FSSAI Ayurveda Aahar Regulations 2022", category: "fssai", status: "conditional" },
    { id: "obl-005-3", title: "EU THMPD dossier", description: "Traditional-use registration needs 30 years' evidence, 15 within the EU.", citation: "Directive 2004/24/EC, Art. 16c", category: "licence", status: "conditional" },
  ],
};

export const examinerObjectionsByDossier: Record<string, ExaminerObjection[]> = {
  "dos-002": [
    { section: "3(d)", title: "New form without enhanced efficacy", argument: "A standardized extract of a known plant is a new form of a known substance; efficacy enhancement over the crude drug is not yet demonstrated on record.", citation: "Patents Act 1970, Sec 3(d)" },
    { section: "novelty", title: "Prior published extraction ratios", argument: "Comparable Bacopa monnieri standardized extracts (bacoside content ~20%) are already disclosed in prior Indian patent filings.", citation: "Draft AYUSH Patent Guidelines, 5 Feb 2025, §4.2" },
    { section: "inventive_step", title: "Routine optimisation", argument: "Ratio optimisation of two known nootropic dravya is treated as routine practice absent a demonstrated synergistic (greater-than-sum) effect.", citation: "Draft AYUSH Patent Guidelines, 5 Feb 2025, §5.1" },
  ],
  "dos-005": [
    { section: "3(e)", title: "Mere admixture", argument: "Four classical rasayana dravya combined without disclosed synergistic data reads as aggregation of known properties, not invention.", citation: "Patents Act 1970, Sec 3(e)" },
    { section: "inventive_step", title: "Combination lacks demonstrated synergy", argument: "Draft guidelines require an effect 'greater than the sum of its individual components'; no such comparative study is on file.", citation: "Draft AYUSH Patent Guidelines, 5 Feb 2025, §5.1" },
  ],
};

export const cultivatorAssessmentByDossier: Record<string, CultivatorAssessment> = {
  "dos-004": {
    species: "Commiphora wightii",
    district: "Nagaur, Rajasthan",
    giEligible: true,
    giNote: "Documented distinct provenance for Rajasthan-sourced guggul supports a GI application.",
    absPosture: "State Biodiversity Board Form I filing required before commercial sale.",
    ppvfrRoute: "Eligible for PPV&FR registration only if a distinct cultivar is developed and characterised.",
  },
};
