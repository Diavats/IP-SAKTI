// MOCK DATA — stands in for the Supabase nodes/edges knowledge graph
// (recursive CTEs in the real backend). Replace with a real graph query.
import type { GraphEdge, GraphNode } from "@/lib/types";

export const graphNodes: GraphNode[] = [
  { id: "dravya-ashwagandha", type: "Dravya", label: "Withania somnifera" },
  { id: "dravya-guduchi", type: "Dravya", label: "Tinospora cordifolia" },
  { id: "dravya-turmeric", type: "Dravya", label: "Curcuma longa" },
  { id: "dravya-neem", type: "Dravya", label: "Azadirachta indica" },
  { id: "dravya-brahmi", type: "Dravya", label: "Bacopa monnieri" },
  { id: "dravya-guggul", type: "Dravya", label: "Commiphora wightii" },
  { id: "formulation-dos-001", type: "Formulation", label: "Ashwagandha–Guduchi–Turmeric Blend" },
  { id: "formulation-dos-002", type: "Formulation", label: "Brahmi–Shankhpushpi Syrup" },
  { id: "formulation-dos-003", type: "Formulation", label: "Neem–Turmeric Gel" },
  { id: "statute-patents-act", type: "Statute", label: "Patents Act 1970" },
  { id: "provision-3p", type: "Provision", label: "Sec 3(p)" },
  { id: "provision-3e", type: "Provision", label: "Sec 3(e)" },
  { id: "patent-verdant", type: "Patent", label: "US2026/0184331 A1" },
  { id: "patent-nordica", type: "Patent", label: "EP4218765 A1" },
  { id: "patent-solstice", type: "Patent", label: "WO2026/154332 A1" },
  { id: "gi-nagaur-guggul", type: "GI", label: "Nagaur Guggul (proposed GI)" },
  { id: "taxon-commiphora", type: "Taxon", label: "Commiphora wightii (syn. C. mukul)" },
];

export const graphEdges: GraphEdge[] = [
  { source: "formulation-dos-001", target: "dravya-ashwagandha", type: "CONTAINS", confidence: 0.98, provenance: "AFI Part I, Formulation 112" },
  { source: "formulation-dos-001", target: "dravya-guduchi", type: "CONTAINS", confidence: 0.98, provenance: "AFI Part I, Formulation 112" },
  { source: "formulation-dos-001", target: "dravya-turmeric", type: "CONTAINS", confidence: 0.98, provenance: "AFI Part I, Formulation 112" },
  { source: "formulation-dos-002", target: "dravya-brahmi", type: "CONTAINS", confidence: 0.95, provenance: "Dossier intake form" },
  { source: "formulation-dos-003", target: "dravya-neem", type: "CONTAINS", confidence: 0.95, provenance: "Dossier intake form" },
  { source: "formulation-dos-003", target: "dravya-turmeric", type: "CONTAINS", confidence: 0.95, provenance: "Dossier intake form" },
  { source: "formulation-dos-001", target: "provision-3e", type: "GOVERNED_BY", confidence: 0.9, provenance: "Patents Act 1970, Sec 3(e)" },
  { source: "provision-3e", target: "statute-patents-act", type: "CONTAINS", confidence: 1, provenance: "India Code" },
  { source: "provision-3p", target: "statute-patents-act", type: "CONTAINS", confidence: 1, provenance: "India Code" },
  { source: "formulation-dos-003", target: "provision-3p", type: "BARRED_BY", confidence: 0.87, provenance: "Classical prior-art match" },
  { source: "patent-verdant", target: "dravya-turmeric", type: "CLAIMS_USE_OF", confidence: 0.83, provenance: "US2026/0184331 A1, Claim 1" },
  { source: "patent-verdant", target: "dravya-neem", type: "CLAIMS_USE_OF", confidence: 0.83, provenance: "US2026/0184331 A1, Claim 1" },
  { source: "patent-verdant", target: "formulation-dos-003", type: "ANTICIPATED_BY", confidence: 0.76, provenance: "NLI entailment score 0.81" },
  { source: "patent-nordica", target: "dravya-brahmi", type: "CLAIMS_USE_OF", confidence: 0.9, provenance: "EP4218765 A1, Claim 1" },
  { source: "patent-nordica", target: "formulation-dos-002", type: "ANTICIPATED_BY", confidence: 0.81, provenance: "NLI entailment score 0.86" },
  { source: "patent-solstice", target: "dravya-ashwagandha", type: "CLAIMS_USE_OF", confidence: 0.88, provenance: "WO2026/154332 A1, Claim 1" },
  { source: "patent-solstice", target: "formulation-dos-001", type: "ANTICIPATED_BY", confidence: 0.7, provenance: "NLI entailment score 0.74" },
  { source: "dravya-guggul", target: "taxon-commiphora", type: "SYNONYM_OF", confidence: 0.97, provenance: "POWO synonym resolution" },
  { source: "gi-nagaur-guggul", target: "dravya-guggul", type: "CONTAINS", confidence: 0.8, provenance: "GI Registry (hand-curated)" },
];
