# SAMHITĀ — SIH 2026, PS 26045 (Ministry of AYUSH / AIIA)

## Context

Team Dia has cleared the internal round on PS 26045 ("IP-SAKTI Sahayak"), but the idea and
deck are still open. The problem statement is written as a near-complete spec, which is the
trap: it hands every competing team an identical build list (RAG + jurisdiction toggle +
citations + Bhashini + classification wizard), so identical builds score identically and the
jury decides on polish — a coin flip.

This plan builds the PS-mandated advisory assistant properly, but on top of an **Ayurveda IP
knowledge graph** that then makes two things possible that no competing team will show: an
adversarial patent-examiner engine, and an outbound biopiracy watchtower that screens live
global patent filings against Indian traditional knowledge.

Intended outcome: a working prototype that (a) satisfies every line of the PS rubric, (b) has
one unmissable demo moment tied to the ministry's actual policy mandate, and (c) leaves Dia
with a portfolio project carrying real supervised-ML artifacts, a measured eval harness, and
LLMOps that hiring managers can verify.

Constraints, taken as fixed: **₹0 budget, free tiers only** (paid scaling shown as a slide,
not used). Team of six with two reliable coders, one security/data owner, one researcher and
one deck-builder who each need explicit briefs, and one unreliable frontend owner who is
**not on the critical path**.

---

## 1. The system

**SAMHITĀ** (संहिता — "the compendium," the word Ayurvedic law itself uses for its
First-Schedule authoritative texts). One knowledge graph, three engines on it.

| Engine | Direction | What it does |
|---|---|---|
| **Sahayak** सहायक | Inbound | Regulatory Digital Twin of a formulation + counterfactual Simulator |
| **Parīkṣā** परीक्षा | Inward | Adversarial examiner — attacks your own filing under Sec 3(p)/3(e)/3(d), novelty, inventive step |
| **Prahari** प्रहरी | Outbound | Screens global patent filings for misappropriation of Indian TK; drafts prior-art dossiers |

### 1.1 Sahayak — the Regulatory Digital Twin

Not a chat thread. The user creates a **Formulation Dossier** object: dravya list, sourcing
(wild-collected / cultivated / imported), claimed indication, target market, classical text
reference if any. That object is the twin. Agents act on it:

- **Classifier** → one of six regulatory categories (classical/generic · patent-or-proprietary ·
  new/non-classical drug · phytopharmaceutical · Ayurveda-Aahar/nutraceutical · cosmetic),
  with the exact rule cited and a calibrated confidence.
- **Obligation Planner** → the derived duty-set: manufacturing licence path, ABS obligations
  under the Biological Diversity Act, DMR (OA) Act advertising limits, ASU labelling rules,
  FSSAI Ayurveda-Aahar if food. Includes the **ABS benefit-sharing calculator** (which dravya
  trigger NBA/SBB routing, which fall under the normally-traded-commodities exemption).
- **IP Router** → which of the seven IP regimes apply, and critically which are *barred*.
- **Simulator** → counterfactuals on the twin. *"Reformulate as a phytopharmaceutical instead
  of a proprietary medicine: patent viability Barred → Possible, but you incur safety-and-
  effectiveness data and a CTRI-registered trial."* Includes the **export market-access
  simulator** (EU THMPD traditional-use evidence, US DSHEA/NDI, Gulf registration) — this is
  what makes the jurisdiction toggle mean something instead of being a UI switch.

### 1.2 Parīkṣā — the adversarial examiner

Upload a draft application or a formulation. A panel of agents argues *against* the user as an
Indian Patent Office examiner would, each objection grounded in a cited section plus a real
prior-art passage:

- **Sec 3(p)** — is this in effect traditional knowledge, or an aggregation/duplication of
  known properties of traditionally known components?
- **Sec 3(e)** — mere admixture resulting only in aggregation of properties. *This is the
  provision that actually kills Ayurvedic polyherbal patents, and nobody discusses it.*
- **Sec 3(d)** — new form of a known substance without enhanced efficacy.
- Novelty and inventive step against the prior-art graph.

Then a **prosecution-strategy** agent proposes claim amendments that could survive. Reuses
Prahari's NLI + graph machinery pointed inward — roughly two extra days for a second wow moment,
so the demo does not rest entirely on Prahari.

### 1.3 Prahari — the biopiracy watchtower

India spent years and public money revoking the turmeric and neem patents. TKDL was built for
exactly this — but it is **reactive and closed**: it helps only when a foreign examiner happens
to search it. Nobody systematically watches world filings for misappropriation.

Pipeline: sweep global patent corpora on CPC `A61K36/*` (medicinal preparations of plant
origin) → extract (species, therapeutic use, assignee, jurisdiction) triples from claims →
resolve claimed species through botanical-synonym APIs (patents routinely use obsolete or
synonymous binomials) → entail each claim against the Ayurvedic prior-art graph → score
misappropriation risk → **draft a filing-ready prior-art dossier** with verse-level citations,
formatted as a third-party observation (EPC Art. 115 / ePCT third-party observations) or an
Indian Sec 25(1) pre-grant opposition.

**Demo moment:** pull a currently-pending foreign application claiming an Ayurvedic use of an
Indian plant; one click produces the dossier that would defeat it.

### 1.4 The TKDL honesty play

TKDL has **no public API** — access is under a non-disclosure agreement (17 patent offices,
plus registered Indian users since the 2022 Cabinet approval). Half the finalists will demo a
fake "TKDL search."

We build a **documented `PriorArtSource` adapter interface** with two implementations: a
legally-open surrogate (Ayurvedic Pharmacopoeia of India + Ayurvedic Formulary of India, both
public) and a stubbed `TKDLAdapter` that CSIR can wire up behind the same interface on day one.
State this on a slide. Honesty about a constraint plus an architecture that survives it reads
as senior — and AIIA judges will know which teams are bluffing.

---

## 2. Architecture

Your pasted Architecture #1 is correct and is reused essentially unchanged; the "digital twin"
is reinterpreted as a Formulation Dossier. Architecture #2 (computer-use agent loop) is dropped.

```
INGESTORS (scheduled, GitHub Actions cron)
  India Code · e-Gazette · AYUSH & CDSCO circulars · FSSAI · GI Journal
  PCIM&H (API/AFI PDFs) · WIPO Lex · Indian Kanoon
  Google Patents BigQuery · EPO OPS · PatentsView · POWO/IPNI/GBIF
        │
        ▼
NORMALIZER  →  entity/relation extraction (LLM structured output + NLI verification)
        │        Devanagari OCR + verse segmentation for classical texts
        ▼
STRUCTURED STATE  (Supabase Postgres, single free tier)
  ├─ Knowledge graph        nodes + edges tables, recursive CTEs   ← relationships
  ├─ Twin state             formulation_dossier + derived facts     ← current snapshot
  ├─ pgvector               versioned statute/treaty/monograph chunks
  └─ corpus_version         content hash, effective_from/to, source_url, fetched_at
        │  ▲
        ▼  │
AGENT LAYER  (FastAPI + LangGraph, Python, on HF Spaces free CPU)
  ├─ Sahayak:  Classifier → Obligation Planner → IP Router → Simulator
  ├─ Parīkṣā:  Objection panel (3p / 3e / 3d / novelty / inventive step) → Strategy
  ├─ Prahari:  Watcher → Species resolver → Claim-vs-prior-art NLI → Risk scorer → Dossier
  └─ Shared:   Retriever (hybrid) → Reranker → Grounded generator → Abstention gate
        │
        ▼
ANSWER + CITATIONS + CONFIDENCE + REASONING TRACE   (or a logged abstention → human facilitator)
        │
        ▼
Next.js app:  Dossier workspace · Cytoscape graph viz · jurisdiction toggle · /evals scorecard
```

### Service boundaries (one repo, mapped to parallel worktrees)

| Worktree | Owns | Lane owner |
|---|---|---|
| `wt-corpus` | Ingestors, OCR, chunking, `corpus_version`, embeddings | Devansh |
| `wt-graph` | Node/edge schema, extraction, graph query API | Devansh |
| `wt-brain` | FastAPI + LangGraph, all agents, model serving | Dia |
| `wt-evals` | Gold set, harness, metrics, CI regression gates | Dia |
| `wt-prahari` | Patent ingest, species resolution, matching, dossier gen | Dia |
| `wt-web` | Next.js UI, Cytoscape viz, /evals page | 21st.dev + `impeccable` skill (no human dependency) |
| `wt-data` | Supabase schema, RLS, audit log, consent ledger, DPDP | Saima |

---

## 3. Knowledge graph schema

Kept deliberately small and curated — hundreds to low thousands of nodes, not millions. That is
what makes it buildable in weeks and queryable without a graph database.

**Node types:** `Dravya` (botanical/mineral/animal substance) · `Formulation` · `TextVerse`
(śloka-level reference into a First-Schedule text) · `Statute` · `Provision` (section/rule) ·
`Treaty` · `TreatyArticle` · `Patent` · `GI` · `Trademark` · `ABSObligation` ·
`RegulatoryCategory` · `Jurisdiction` · `Taxon` (with synonym set)

**Edge types:** `CONTAINS` · `CITED_IN_TEXT` · `GOVERNED_BY` · `BARRED_BY` · `REQUIRES` ·
`TRIGGERS_ABS` · `CLAIMS_USE_OF` · `ANTICIPATED_BY` · `SYNONYM_OF` · `CONFLICTS_WITH` ·
`AMENDED_BY` · `EFFECTIVE_IN`

Stored as `nodes(id, type, props jsonb)` and `edges(src, dst, type, props jsonb, confidence,
provenance)` in Supabase, traversed with recursive CTEs. **Neo4j is dropped** — it is one more
free tier to babysit and one more demo-day failure mode for a graph this size. Frontend renders
directly from Postgres with Cytoscape.js.

Every edge carries `provenance` (the source chunk id) and `confidence`. Nothing enters the graph
without a citable source — the same rule the product enforces on its own answers.

---

## 4. Datasets

All open and legally usable. Himanshi's brief is one row per source: exact URL, format, licence,
what to extract.

### National corpus (India Code — `indiacode.nic.in`)
Patents Act 1970 + Patents Rules 2003 (as amended 2024) · Geographical Indications Act 1999 ·
Trade Marks Act 1999 · Designs Act 2000 · Copyright Act 1957 · PPV&FR Act 2001 ·
Biological Diversity Act 2002 (as amended 2023) + Biological Diversity Rules 2024 ·
Drugs and Cosmetics Act 1940 + Rules 1945 (First Schedule; ASU chapters; labelling rules;
safety-and-effectiveness provisions) · Drugs and Magic Remedies (Objectionable Advertisements)
Act 1954 · FSS Act 2006 + FSSAI Ayurveda Aahar Regulations 2022 · New Drugs and Clinical Trials
Rules 2019 (phytopharmaceutical route)

### Classical / pharmacopoeial (the moat)
**Ayurvedic Pharmacopoeia of India** and **Ayurvedic Formulary of India**, PCIM&H —
`pcimh.gov.in`. Monographs give Sanskrit name, Latin binomial, part used, rasa/guna/virya/vipaka,
karma, therapeutic uses, constituent formulations. This is simultaneously the classical-
formulation ground truth **and** the prior-art surrogate corpus. Tedious to parse, which is
precisely why it is defensible. Start with AFI Part I (cleanest scans), expand outward.

### Registries and regulators
IP India — InPASS full-text search, GI Registry + GI Journal PDFs, trade marks, designs
(`ipindia.gov.in`; **no official API — scrape-only, treat as a low-frequency batch job**) ·
National Biodiversity Authority ABS approvals, Form I/II/III, normally-traded-commodities list
(`nbaindia.org`) · NMPB / e-Charak medicinal plant data · AYUSH and CDSCO gazette notifications
and circulars · FSSAI

### International
WIPO Lex — TRIPS, PCT, Madrid, Hague, Budapest, **WIPO GRATK Treaty 2024** (disclosure of origin
of genetic resources and associated TK) · CBD and Nagoya Protocol (`cbd.int/abs`) ·
EU Traditional Herbal Medicinal Products Directive · US FDA DSHEA/NDI guidance

### Case law
Indian Kanoon (`indiankanoon.org`, token-gated API) · the canonical TK cases — turmeric
US5401504 re-examination, neem EP436257 revocation, Basmati · Delhi HC / IPAB IP decisions

### Patent corpora for Prahari (real, free, structured)
- **Google Patents Public Data on BigQuery** — `patents-public-data.patents.publications`,
  free 1 TB/month query tier, global full text with CPC codes. The killer query:
  `CPC LIKE 'A61K36%' AND full_text matches an Indian medicinal-plant binomial AND assignee
  country != 'IN'`. This produces a live watchlist and is the single most important data source.
- **EPO OPS** — `developers.epo.org`, free tier
- **USPTO PatentsView API** — free key, clean JSON
- **WIPO PATENTSCOPE**, **Lens.org** (free non-commercial)

### Taxonomy (entity resolution — a real ML problem with a real free API)
**POWO / IPNI** (`ipni.org/api/1/search`), **GBIF** (`api.gbif.org/v1`), World Flora Online.
Needed because patents deliberately or incidentally use synonymous and obsolete binomials.

### Language
**Bhashini / ULCA** (`bhashini.gov.in`) — free API key via registration. Himanshi starts this on
day 1; registration latency is a tracked risk.

> **Standing rule for this spec:** every statutory reference above is a *pointer for Himanshi to
> verify against India Code*, not an authority. The product's premise is that it never fabricates
> authority; the spec must hold itself to the same standard.

---

## 5. Models (free tier only)

### Hugging Face
| Model | Role |
|---|---|
| `BAAI/bge-m3` | Multilingual dense retrieval, 8k context — primary embedder |
| `BAAI/bge-reranker-v2-m3` | Cross-encoder reranker — used off the shelf, **evaluated, not fine-tuned** |
| `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` | **The ML core.** Entailment powers (a) citation faithfulness scoring, (b) Prahari's claim-vs-prior-art anticipation, (c) Parīkṣā's objections. One model, three jobs, CPU-runnable |
| `ai4bharat/indictrans2-{en-indic,indic-en}-1B` | Translation fallback if Bhashini stalls |
| `ai4bharat/indic-conformer-600m-multilingual` | ASR fallback |
| `ai4bharat/IndicBERTv2-MLM-only` | Backbone for the formulation classifier |
| `ds4sd/docling` + Tesseract (Devanagari) | Pharmacopoeia PDF → structured text |

### NVIDIA (free tier — real components, not name-drops)
- **NeMo Guardrails** (open source) — topical rails, safety rails, and a mandatory output rail
  enforcing the "information, not legal advice" disclaimer and blocking uncited claims. This is
  the PS's "guardrails" requirement, implemented rather than asserted.
- **build.nvidia.com free credits** — `nvidia/llama-3.2-nv-rerankqa-1b-v2` as a second baseline
  in the reranker bake-off, `nvidia/nv-embedqa-e5-v5` as an embedding baseline. Their value here
  is as *measured comparison points* in the eval table.

### LLM layer
Gemini 2.x Flash primary; Groq and OpenRouter free models as fallbacks, behind a **model router**
with per-node model selection. The router is both a cost/latency talking point and demo-day
insurance.

### Trained in-house (~1.5 days total — the resume artifacts)
1. **Formulation classifier** — 6 classes. Labels bootstrap deterministically from the Formulary
   plus rules, so ~2–3k examples cost hours. Classification head over `bge-m3` embeddings, or a
   small IndicBERTv2 fine-tune on Kaggle T4. Produces a confusion matrix and macro-F1, and it is
   *load-bearing*: it is the routing decision the whole system hangs on.
2. **Calibrated abstention gate** — logistic regression / gradient boosting over retrieval
   features (max cosine, reranker score, NLI entailment score, source tier, jurisdiction match)
   predicting "will this answer be citation-faithful?" Powers the PS's required confidence
   indicator with a model instead of a heuristic, and yields a reliability curve and an **ECE**.

> **Deliberately not doing:** fine-tuning a cross-encoder reranker on synthetic relevance pairs.
> It costs 5–6 days, may well lose to off-the-shelf `bge-reranker-v2-m3` (turning your headline
> into a negative result), and is invisible to judges. Measuring retrieval properly is the
> stronger hiring signal and one-fifth the cost.

---

## 6. Tech stack (final)

| Layer | Choice | Change vs. your reusable stack |
|---|---|---|
| Frontend + BFF | Next.js API routes + shadcn/ui + Tailwind, Vercel hobby | **Unchanged** |
| Data + auth | Supabase — Postgres, pgvector, auth, realtime, storage, RLS | **Unchanged** |
| Agent runtime | **FastAPI + LangGraph (Python) on HF Spaces free CPU** | **New service.** The ML lives in Python (Docling, sentence-transformers, NLI); Spaces also hosts bge-m3 + the NLI model locally so API quota is never burned on scoring. Stays in the same repo under `services/brain` |
| Graph store | Supabase `nodes`/`edges` + recursive CTEs, Cytoscape.js viz | **Neo4j dropped** |
| Voice | **Bhashini ASR/TTS** | **Vapi dropped** — Bhashini is named in the PS and is what judges look for |
| Vision | Gemini Flash free vision, scoped to the label scanner only | **Generic OpenCV tier dropped** |
| Web discovery | Tavily MCP free tier (amendment watcher) | **Unchanged** |
| Observability | **Langfuse free cloud** — tracing, prompt management, eval datasets, scored runs | **New** |
| Guardrails | **NeMo Guardrails** | **New** |
| CI | GitHub Actions — nightly corpus diff + eval regression gate | **New** |
| Dev | Parallel Claude Code agents in isolated worktrees per §2 | **Unchanged** |

---

## 7. Evaluation harness (a first-class product surface, not a script)

A live `/evals` page in the app shows the current scorecard. Judges reward self-measurement;
hiring managers reward it more.

**Gold set (Himanshi's second deliverable):** 150–250 real questions with correct statutory
answers, stratified across the six formulation categories, the seven IP regimes, national vs.
international, and 40 deliberately out-of-scope or unanswerable questions to test abstention.
Stored as a Langfuse dataset.

| Metric | Method | Target |
|---|---|---|
| Retrieval nDCG@10 / recall@20 | Bake-off: BM25 · dense (bge-m3) · hybrid · +bge-reranker · +NVIDIA rerank baseline | Hybrid+rerank ≥ 0.70 nDCG@10, reported against the BM25 baseline |
| Citation faithfulness | Per-sentence NLI entailment against the cited span | ≥ 0.90 |
| Hallucinated-authority rate | Cited section exists **and** says what was claimed | < 2% |
| Answer accuracy | LLM judge, **calibrated against human labels with Cohen's κ reported** | ≥ 85% |
| Abstention precision / ECE | Trained gate vs. the out-of-scope subset; reliability curve | precision ≥ 0.80, ECE ≤ 0.05 |
| Multilingual delta | 60-question translated subset, per language | ≤ 5 points vs. English |
| Latency p95 | End-to-end with rerank | < 4 s |
| Prahari precision@20 | Human review of top-ranked risk candidates | Reported honestly, whatever it is |

**LLM-as-judge calibration is non-negotiable** — an uncalibrated judge is a vibe with a number
attached. Reporting κ against human labels is a genuinely senior signal at ~1 day of cost.

---

## 8. LLMOps — the Corpus Time Machine

The PS says "keep its corpus current as the law changes." Almost nobody will build it. It is
cheap, impossible to fake, and it is the single best LLMOps story on the resume.

- Every corpus document is version-tracked: content hash, `effective_from` / `effective_to`,
  source URL, fetch timestamp.
- A nightly GitHub Actions agent re-fetches sources and diffs them (Tavily for discovery of new
  gazette notifications and circulars).
- On detected amendment: re-embed **only affected chunks**, bump the corpus version, and
  **re-run the eval suite as a regression gate**.
- Answers previously served are linked to the corpus version that produced them, so the system
  can tell a past user *"3 of your saved answers are now stale — the 2024 Rules changed this."*
- A time-travel toggle in the UI: "show me what the answer was before the 2023 amendment."

Everything traced in Langfuse; every prompt versioned there rather than in code.

---

## 9. Guardrails, privacy, security (Saima's lane — a real lane, not a side job)

The PS explicitly demands DPDP alignment, audit and privacy. This is a slide and a differentiator.

- **Supabase RLS** on every table; dossiers are private by default.
- **Audit log** — append-only, every query, retrieval set, model version, corpus version and
  answer, so any answer can be reconstructed after the fact.
- **Consent ledger** — the PS requires that a user's *paid* subscriptions be touched only with
  explicit, logged permission. Model it as a first-class table: grant, scope, expiry, revocation,
  and a per-access log entry. Almost no team will implement this literally.
- **DPDP posture** — data minimisation, purpose limitation, retention windows, export and erasure
  endpoints.
- **NeMo Guardrails rails** — topical (refuse off-domain), safety, and a mandatory output rail
  that blocks any uncited legal claim and appends the standing "information, not legal advice"
  disclaimer.
- **Abstention → escalation** — below the calibrated confidence threshold the system refuses and
  routes to a human IP facilitator, logging the escalation.

---

## 10. Multilingual

Bhashini primary (ASR, NMT, TTS via ULCA pipelines), IndicTrans2 + IndicConformer as fallback.

**The design detail that shows legal literacy:** translate the question in and the answer out,
but **never translate the citation itself**. Statutory text stays in its authentic form with a
translated gloss beside it, because a translated statute is not the statute. Retrieval runs in
English against the English corpus with translated queries; per-language retrieval quality is
measured and reported, which is exactly the "multilingual quality" evaluable the PS asks for.

---

## 11. Build schedule — 4 phases, each with a cut-line

Every phase ends at a state that is demoable on its own. A slipped week costs a feature, never
the demo.

**Phase 0 · Days 1–3 · Foundation**
Supabase schema + RLS · corpus ingestion skeleton + `corpus_version` · Bhashini registration
started · Himanshi's source-hunt checklist · gold set v1 (50 questions) · Langfuse wired.

**Phase 1 · Days 4–10 · Citation-grounded RAG MVP** ← **CUT-LINE: submittable on its own**
Hybrid retrieval + rerank · grounded generation with mandatory citations · jurisdiction toggle
with visibly separate answer sets · abstention v1 (heuristic) · `/evals` page live · retrieval
bake-off run and tabled.

**Phase 2 · Days 11–17 · Graph, Twin, Parīkṣā** ← **CUT-LINE: a strong, complete project**
Pharmacopoeia/Formulary → graph extraction · Formulation Dossier + Twin · trained formulation
classifier · Obligation Planner + ABS calculator · Simulator with export market access ·
Parīkṣā objection panel · Cytoscape graph viz.

**Phase 3 · Days 18–24 · Prahari + Time Machine** ← **CUT-LINE: the winning project**
BigQuery patent snapshot (~40k records on CPC A61K36) · species resolution via POWO/IPNI/GBIF ·
NLI claim-vs-prior-art matching · risk scorer · dossier generator with verse-level citations ·
nightly corpus diff + eval regression CI · trained abstention gate with calibration curve.

**Phase 4 · Days 25–28 · Language, polish, pitch**
Bhashini multilingual + voice · label-compliance vision scanner · offline demo mode with cached
responses · UI polish via 21st.dev + `impeccable` · deck built from Vansh's script · demo video.

**Future roadmap slide (explicitly not built):** form pre-fill → downloadable PDF for the actual
IP India / NBA / FSSAI forms; Telegram/WhatsApp reach channel for cultivators; real TKDL adapter
behind the existing interface; paid-tier scaling (managed vector DB, dedicated inference).

---

## 12. Risk register

| Risk | Mitigation |
|---|---|
| Bhashini registration latency | Start day 1; IndicTrans2 + IndicConformer fallback already in the stack |
| BigQuery free-tier quota | Pre-materialise a ~40k-record snapshot once; never query live during a demo |
| Pharmacopoeia PDF OCR quality | Start with AFI Part I (cleanest); Gemini Flash vision for hard scans; graph accepts partial coverage |
| IP India scraping fragility | Low-frequency batch only; nothing on the demo path depends on it |
| Demo-day network failure | Offline demo mode with cached responses and a pre-materialised watchlist |
| Scope creep across three engines | Hard cut-lines per phase; Phase 1 alone is submittable |
| Sandali not delivering frontend | Already assumed. UI built with 21st.dev + `impeccable`; nothing critical waits on her |
| Overclaiming in the deck | Every statutory citation verified by Himanshi against India Code before it reaches a slide |

---

## 13. Resume value

**Metric templates** (fill from actual runs — never ship a number you did not measure):

- Built a 3-engine, N-node LangGraph system over a version-tracked corpus of ~X chunks spanning
  14 Indian statutes and 8 international instruments.
- Raised citation faithfulness from A% to B% on a 200-question expert-reviewed gold set using
  NLI-based entailment scoring; hallucinated-authority rate held under 2%.
- Trained a calibrated abstention classifier (ECE 0.0X) cutting unsupported answers by N% at an
  8% abstention rate.
- Hybrid BM25 + bge-m3 retrieval with cross-encoder rerank: nDCG@10 0.XX against a 0.YY BM25
  baseline; p95 latency 1.Xs.
- Calibrated an LLM judge against human labels (Cohen's κ = 0.XX) before trusting it for
  automated evaluation.
- Nightly corpus-diff pipeline plus eval-regression CI caught N statutory amendments and
  auto-flagged M stale answers.
- Screened ~40k global patent records (CPC A61K36) against a ~900-node Ayurvedic prior-art graph;
  surfaced N high-risk misappropriation candidates with auto-drafted prior-art dossiers.
- Delivered 11 Indian languages via Bhashini with a per-language accuracy delta under 5 points.

**JD mapping** — RAG at production quality · multi-agent orchestration (LangGraph) · evaluation
and guardrails · vector search and hybrid retrieval · knowledge graphs · LLMOps and observability
(Langfuse, regression CI, prompt versioning) · model routing and cost control · supervised
training and **calibration** · multilingual NLP · Python + TypeScript · cloud deployment. The
calibration and eval-harness work is what separates this from the API-wrapper projects that
dominate entry-level portfolios.

---

## 14. Feasibility · viability · scalability (the deck's last three slides)

**Feasible** — every dependency is a free tier or an open dataset; Phase 1 alone satisfies the
PS; three of the four phases have independent cut-lines; the graph is curated in the hundreds of
nodes, not scraped in the millions.

**Viable** — the ministry already owns the authoritative corpora and already funds TKDL; SAMHITĀ
is an interface layer over assets that exist, not a new institution. The adapter interface means
CSIR can plug real TKDL in without a rewrite.

**Scalable** — Postgres + pgvector to roughly a million chunks before anything needs to change;
the ingestion layer is already scheduled and incremental; the agent service is stateless and
horizontally scalable; the paid path (managed vector store, dedicated inference, real TKDL and
paid registry connectors) is a configuration change, shown on a slide and deliberately not used.

---

## 15. Deliverables to produce after approval

1. Commit this design as `docs/superpowers/specs/2026-09-10-samhita-design.md`.
2. **Tabbed web page** (published Artifact) — one tab per lane so Devansh, Saima, Himanshi and
   Vansh each read only their own section without reading the whole spec.
3. **Vansh's deck script** — a standalone document, slide by slide: what goes on each slide,
   which screenshot, which number, which sentence is spoken aloud.
4. **Himanshi's research brief** — one row per source: URL, format, licence, what to extract;
   plus the gold-set question template and stratification quotas.
5. Invoke the `writing-plans` skill to turn this design into the executable implementation plan
   with per-worktree task breakdown.

## 16. Verification

- **Phase gates:** each phase ends with the eval suite run and the `/evals` scorecard updated;
  a phase is not done until its metrics are on the page.
- **Retrieval:** the bake-off table (BM25 / dense / hybrid / reranked / NVIDIA baseline) must be
  reproducible from a single command.
- **Faithfulness:** NLI entailment scoring run over the full gold set; every failure case
  inspected by hand at least once.
- **Judge calibration:** Cohen's κ computed against at least 50 human-labelled answers before the
  LLM judge is trusted for any reported number.
- **Guardrails:** an adversarial prompt set (jailbreaks, requests for legal advice, out-of-scope,
  fabricated-statute bait) run as part of CI; zero uncited legal claims may escape the output rail.
- **Prahari:** top-20 risk candidates reviewed by hand; at least one dossier read end-to-end
  against the actual published application to confirm the citations say what the dossier claims.
- **Demo:** full run-through in offline mode with the network disabled, twice, before the pitch.
