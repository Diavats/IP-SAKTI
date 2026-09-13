import type { DossierStatus, FormulationCategory, ObligationCategory } from "@/lib/types";

export const classificationLabels: Record<FormulationCategory, string> = {
  classical_generic: "Classical / generic",
  patent_or_proprietary: "Patent-or-proprietary",
  new_non_classical: "New / non-classical drug",
  phytopharmaceutical: "Phytopharmaceutical",
  ayurveda_aahar: "Ayurveda-Aahar",
  cosmetic: "Cosmetic",
};

export const statusLabels: Record<DossierStatus, string> = {
  draft: "Draft",
  classified: "Classified",
  mapped: "IP map generated",
  under_review: "Under review",
};

export const obligationCategoryLabels: Record<ObligationCategory, string> = {
  licence: "Licence",
  abs: "Access & benefit-sharing",
  advertising: "Advertising",
  labelling: "Labelling",
  fssai: "FSSAI",
};
