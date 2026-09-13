// UI-only illustrative excerpts for the Ask source pane, keyed by citation
// label. The mock query layer (src/lib/mock/queries.ts) only carries a
// label + publisher, not full statutory text - this fills the source pane
// with representative text so the citation-click interaction has something
// real to show, clearly marked illustrative per the same convention as
// /evals ("Illustrative values for this build").
export const statuteExcerpts: Record<string, string> = {
  "Patents Act 1970, Sec 3(e)":
    "3. What are not inventions. — The following are not inventions within the meaning of this Act — … (e) a substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof or a process for producing such substance;",
  "Patents Act 1970, Sec 3(p)":
    "3. What are not inventions. — … (p) an invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.",
  "Patents Act 1970, Sec 3(d)":
    "3. What are not inventions. — … (d) the mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance …",
  "Patents Act 1970, Sec 25(1)":
    "25. Opposition to the patent. — (1) At any time within a period of four months from the date of publication of the application for a patent … any person may, in writing, represent by way of opposition to the Controller against the grant of patent …",
  "Trade Marks Act 1999, Sec 9":
    "9. Absolute grounds for refusal of registration. — (1) The trade marks — (a) which are devoid of any distinctive character … (b) which consist exclusively of marks or indications which may serve, in trade, to designate the kind, quality, quantity, intended purpose, values, geographical origin … shall not be registered.",
  "GI Act 1999, Sec 2(1)(e)":
    "2. Definitions. — (1)(e) \"geographical indication\", in relation to goods, means an indication which identifies such goods as agricultural goods, natural goods or manufactured goods as originating, or manufactured in the territory of a country, or a region or locality in that territory …",
  "Biological Diversity Act 2002, Sec 7":
    "7. Prior intimation to State Biodiversity Board for obtaining biological resource for certain purposes. — No person … shall obtain any biological resource occurring in India for commercial utilisation … except after giving prior intimation to the State Biodiversity Board concerned.",
  "Drugs & Cosmetics Rules 1945, Sched. T":
    "Schedule T — Good Manufacturing Practices for Ayurvedic, Siddha and Unani Medicines. Lays down the premises, raw-material, manufacturing and quality-control requirements a licensed unit must meet.",
  "Drugs & Cosmetics Act 1940, Ch. IV":
    "Chapter IV — Ayurvedic, Siddha and Unani Drugs. Governs manufacture, sale and standards of these drugs, including misbranding, adulteration and spurious-drug provisions.",
  "Draft AYUSH Patent Guidelines, 5 Feb 2025, §5.1":
    "§5.1 (Draft — not yet finalised). Examiners should assess novelty of Ayurvedic formulations against the classical corpus (Charaka, Sushruta, Ashtanga Hridaya and the Ayurvedic Formulary of India) before applying Sec 3(p).",
  "AFI Part I, Formulation 112":
    "Ayurvedic Formulary of India, Part I, Formulation 112 — classical polyherbal reference formulation and its constituent dravya list, as compiled by the Ayurvedic Pharmacopoeia Committee.",
  "AFI Part I":
    "Ayurvedic Formulary of India, Part I — the classical-generic reference compendium used to assess whether a formulation's composition is already publicly known.",
  "Patent Office Journal, Issue #37":
    "Patent Office Journal (weekly), Issue #37 — published list of applications accepted and open for pre-grant opposition under Sec 25(1) during the current window.",
  "Directive 2004/24/EC, Art. 16c":
    "Directive 2004/24/EC, Art. 16c (Traditional Herbal Medicinal Products, EU) — simplified registration route requiring at least 30 years of traditional use, 15 of them within the EU.",
};

export const defaultStatuteExcerptNote =
  "Full statutory text is not part of this mock corpus — this is an illustrative excerpt for the demo, not a verified quotation.";
