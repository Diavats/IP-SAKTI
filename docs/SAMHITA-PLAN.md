# SAMHITĀ — Build Plan

**SIH 2026 · Problem Statement 26045 · Ministry of AYUSH / All India Institute of Ayurveda**
Our implementation of *IP-SAKTI Sahayak*.

Version 1.0 · 10 September 2026

---

## 1. Context

### 1.1 What the problem statement actually asks

The PS names **two** pain points, not one:

> "legitimate Ayurvedic innovation is **under-protected and under-commercialised**, while India's traditional knowledge remains **exposed to misappropriation abroad**."

Our two agents map onto those two clauses exactly. Most teams will read only the first clause, because the second appears as a single throwaway phrase later ("TKDL / prior-art pointer").

The PS also names its own success criteria — **answer accuracy, citation correctness, safe abstention, multilingual quality**. Our scorecard uses those four words verbatim.

And the operative noun in the title is **IP**. The PS states that intellectual property "is inseparable from how the product is regulated" — meaning regulatory classification is the *input* that determines IP posture, not the destination. Our primary output is therefore an **IP Protection Map**, not a compliance checklist.

### 1.2 Real constraints

| Constraint | Value |
|---|---|
| Budget | **₹0.** Free tiers only. Paid scaling is a slide, never a dependency |
| Timeline | 4 weeks |
| Engineering capacity | Dia + Devansh, ~3.5 hrs/day each → **~196 person-hours**, plus ~30 hrs from Saima |
| Frontend | Sandali but nothing critical waits on her |
| Non-technical lanes | Vansh (deck) and Himanshi (research) need explicit written briefs, not verbal direction |

**196 hours is roughly five person-weeks of full-time work.** The scope below is cut to fit it, with Claude Code agents doing the typing and the humans doing specification, review and data judgement. That division is why this is achievable — but it means every worktree needs an agent-ready spec before coding starts.

---

## 2. What we are building

**SAMHITĀ** (संहिता — "the compendium," the word Ayurvedic law itself uses for its First-Schedule authoritative texts). **One knowledge graph, two agents.**

### 2.1 The agentic RAG shell

Both agents sit inside an orchestration layer. They are not two products bolted together — they are
nodes in one graph, and the shell is what stops a one-second question costing twelve seconds of
agent loop.

```
                        /- Orchestrator - intent + entity extraction
  User query ---------->|
                        \- Depth Controller --> QUICK   classifier + one retrieval pass
                                             --> GUIDED  + graph traversal + profile engine
                                             --> DEEP    + external tools, multi-hop search
                                                   |
  Scheduler (Fridays) --> Prahari ---------------->|   <- second entry point, never in the query path
                                                   v
                              Deterministic retrieval (BM25 + vector + graph)
                                                   v
                                    LLM reasoning and generation
                                                   v
                         Verification Agent (deterministic, NLI entailment)
                                                   v
                   Confidence OK -> answer      Confidence low -> abstain -> human
                                                   v
                                    Dossier memory / state --+
                                                  <----------+ feeds future queries
```

**Depth is decided automatically, never asked upfront.** The system answers at QUICK by default and
renders escalation affordances under the answer — *"Show the full IP map"* · *"Search global patents."*
Asking how deep to go adds a step to every query including the trivial ones, and most people cannot
say what depth they want before they have seen an answer.

**Why the Verification Agent is its own node.** Most teams put "cite your sources" in the prompt,
which means the model grades its own homework. Pulling verification out as a separate deterministic
node — NLI entailment of each generated sentence against the span it cites — is what makes the
citation guarantee real rather than aspirational.

Every answer carries the **corpus version** that produced it, which is what later lets the system
flag an answer as stale (§9).

### 2.2 Agent 1 — Sahayak (सहायक): the IP Protection Map

The user creates a **Formulation Dossier** — dravya list, sourcing, claimed indication, target market, classical text reference if any. That object persists and accumulates derived facts. It is the unit of interaction; there is no bare chat box as the primary surface.

The agent produces a map of the **protectable surface across all seven IP regimes**, each marked open or barred, each with the citation that decides it:

| Regime | Typical verdict for a classical formulation |
|---|---|
| Patent | Usually **BARRED** — Sec 3(p); Sec 3(e) for polyherbals. Stated with the section, not vaguely |
| Trade mark | **OPEN** — almost always the real answer, and the one MSMEs never think of |
| Geographical indication | Open if regional provenance is genuine |
| Copyright | Open on label art, literature, package copy |
| Design | Open on bottle, pack, applicator form |
| Trade secret | Open on process and ratios — often the only real moat |
| Plant variety (PPV&FR) | Open if a distinct cultivar has been developed |

Supporting flows, all feeding the map:

- **Formulation classifier** — six categories (classical/generic · patent-or-proprietary · new/non-classical drug · phytopharmaceutical · Ayurveda-Aahar · cosmetic), asking the *minimum* clarifying questions the PS requires, returning the cited rule and a calibrated confidence.
- **Obligation planner** — licence path, ABS posture, advertising limits, labelling, FSSAI. Driven by the regulatory-profile engine (§7).
- **Examiner View** — fires **automatically, and only when the patent verdict is "may be open."** A risky verdict carries an obligation to show why an examiner might disagree, so this is honesty about an uncertain answer rather than a feature the user has to discover — and because it runs only on the minority case, it costs nothing on the common path. It argues under Sec 3(p), Sec 3(e) (mere admixture — the provision that actually kills polyherbal patents), Sec 3(d), novelty and inventive step, grounded in the IP Office's own **Draft Guidelines for AYUSH patent applications (5 Feb 2025)**, which require a combination to show an effect *"greater than the sum of its individual components"* and treat ratio-optimisation or single-component isolation as *"routine practice."* Until Himanshi confirms their status these remain **draft, and must be labelled draft in the UI** — a citation-grounded product cannot present draft guidance as settled law.
- **Cultivator view** — "I grow X in district Y" → GI eligibility, ABS posture, PPV&FR route. Closes a persona the PS names explicitly.
- **Jurisdiction toggle** — India vs. international, answer sets kept visibly separate.

**The demo's closing line:** *"Patent is barred by Section 3(p). But you have five open doors, and here is the order to file them in."*

### 2.3 Agent 2 — Prahari (प्रहरी, sentinel): the unprompted watcher

**The dossier is the subscription.** Registering a formulation silently registers its species to a
watchlist. The user never supplies a patent number — if they had to, this would be a ChatGPT prompt
with extra steps.

#### The window is the whole point

| Stage | Provision | Watchable? |
|---|---|---|
| Provisional filed | — | No, not public |
| **CAP** — Complete After Provisional, within 12 months | Section 9, non-extendable | No, not public |
| **Published** at 18 months from priority (or ~1 month via Form 9) | **Section 11A** | **Yes — Prahari's trigger** |
| **Opposition window open** | **Section 25(1)** — *any person*, Form 7A, Rule 55 | The moment to act |
| Grant | — | Window closes |
| Post-grant | Section 25(2) — 12 months, *"person interested"* only | Far heavier; effectively litigation |

**No patent may be granted before six months from publication.** That gives every alert a computable
minimum deadline — and it is why we watch at publication rather than at grant. Before grant, stopping
a bad patent costs a form. After grant it costs a lawsuit. Turmeric took India years and crores
precisely because nobody was watching at publication.

#### Primary stream — domestic

| | |
|---|---|
| Source | **Patent Office Journal**, weekly PDF, `ipindia.nic.in`, published every Friday under Section 145 |
| Filter | **IPC** `A61K36/*` — the Journal carries IPC, not CPC |
| Window maths | `earliest_grant = published_on + 6 months`; surface `days_remaining` |
| Ranking | **urgency × risk**, not risk alone — a closing window outranks a marginally better match |
| Output | **Section 25(1) representation, Form 7A under Rule 55** |

Leading with the domestic stream is better on every axis: one defined PDF per week beats a BigQuery
quota; the ministry can act this month for the cost of a form; and no foreign company is named — we
are feeding prior art to our own examiner, which is exactly what Section 25(1) exists for.

#### Secondary stream — foreign (stretch, week 4 only if ahead)

Google Patents BigQuery, CPC `A61K36/*`, non-Indian applicants → third-party observations under
EPC Art. 115, US 37 CFR 1.290, or PCT via ePCT. Carries the sovereignty narrative, but India can act
far less easily on a foreign filing.

#### The loop, running unattended

1. **Scheduled sweep** — Friday's Journal is fetched and parsed.
2. **Diff against state** — application numbers seen before are dropped.
3. **Species resolution** — claimed binomials expanded through botanical synonym APIs. Patents
   routinely use obsolete or synonymous names; naive string matching misses them.
4. **Entailment** — each independent claim scored against candidate Formulary passages with an NLI
   model. *Does the Formulary already teach this?*
5. **Window computation** — days remaining before the earliest possible grant.
6. **Push** — above threshold, the dossier owner is notified. They did not ask.
7. **Draft** — a Form 7A representation is generated with Formulary citations, for human review.

A **national watchlist** seeded with ~50 top dravya runs regardless of whether any user signs up,
giving AIIA a standing dashboard. This is what makes it a ministry instrument rather than a user
tool, and it means the demo does not depend on a populated user base.

**What makes it agentic, stated plainly:** it acts unprompted; it holds state and diffs against it;
it decides what deserves human attention; its output is an artefact, not a reply. A chatbot does
none of the four.

### 2.4 Mandatory legal framing (non-negotiable)

A system that labels a named foreign company a "suspected biopirate" and is wrong is a liability problem for the ministry running it. The fix is free, and it is also the legally correct framing — **a third-party observation does not accuse anyone; it submits prior art that may be relevant to examination.**

- User-facing output says **"prior art potentially relevant to this application."** Never "misappropriation," never "biopiracy," never a named accusation.
- **Human review is mandatory before anything leaves the system.** No auto-filing, no auto-publishing, ever.
- Confidence is displayed on the artefact itself.
- **Disclosure note:** TKDL is deliberately closed *precisely so* traditional knowledge is not further disclosed. Our surrogate corpus uses only the Formulary and Pharmacopoeia — already-published government books — so we disclose nothing new. Stating this shows we understand *why* TKDL is closed.

### 2.5 The TKDL adapter

TKDL has **no public API**; access is under a non-disclosure agreement (17 patent offices, plus registered Indian users since the 2022 Cabinet approval). Competing teams will demo a fake "TKDL search."

We ship a documented `PriorArtSource` interface with two implementations: the legally-open surrogate above, and a stubbed `TKDLAdapter` that CSIR can wire up behind the same interface without a rewrite.

---

## 3. Ownership

AI/ML split is **60% Devansh / 40% Dia**, divided by subsystem rather than by difficulty so both own something end to end and handoffs stay minimal.

| Lane | Owner | Scope |
|---|---|---|
| **Query path** — full stack | **Devansh** | Orchestrator, Depth Controller, corpus ingestion, hybrid retrieval, grounded generation, Verification Agent, formulation classifier, obligation planner, IP Protection Map, regulatory-profile engine, Examiner View |
| **Prahari** — full stack | **Dia** | Journal parser, species resolution, NLI matching, opposition-window maths, urgency ranking, Form 7A generator, scheduler, push |
| **Evaluation + calibration** | **Dia** | Gold-set generation, harness, four PS metrics, calibrated abstention gate, regression CI |
| **Knowledge graph** | **Devansh** | Schema, AFI/API extraction, graph query API |
| **Data + security** | **Saima** | Supabase schema, RLS, audit log, consent ledger, DPDP posture, NIST AI RMF mapping |
| **Frontend** | 21st.dev + `impeccable` | Dossier workspace, Cytoscape graph viz, `/evals` page. **No human dependency** |
| **Research** | **Himanshi** | Source verification, regulatory-profile fields, gold-set sample verification (see separate brief) |
| **Deck** | **Vansh** | Built from a written script, produced separately |

**Dia keeps 40% by volume but 100% of the resume-bearing artifacts** — the calibration model, the eval methodology, and Prahari's matching logic.

---

## 4. Data sources — what we use, and why

Every row states purpose, cleanliness and volume. Nothing is listed that we do not actually ingest.

### 4.1 USING

| Source | What for | Clean? | Volume we take |
|---|---|---|---|
| **India Code mirror** — `indiacode.ecourtsindia.com` | The entire national statutory corpus. Primary retrieval source | **Clean.** Structured JSON / Markdown / Akoma Ntoso, no auth key, bulk CSVs. Verified live: 836 central acts, 77,072 sections, updated 2026-09-10 | ~15 acts + rules → est. **3,000–4,000 sections → ~10,000 chunks** |
| **India Code official** — `indiacode.nic.in` | **Citation of record.** We ingest from the mirror but every citation links to the official URL | Human-browsing portal, no API | Zero ingestion. URL construction only |
| **WIPO Lex** | International layer: TRIPS, CBD, Nagoya, GRATK 2024, PCT, Madrid, Hague, Budapest | **Clean.** Well-structured articles | **8 treaty texts → ~1,200 chunks** |
| **Ayurvedic Formulary of India, Part I** — Internet Archive (`archive.org/details/b32232184`) | The classical-formulation ground truth **and** the prior-art surrogate corpus. Seeds the knowledge graph | **Semi-clean.** 546 pages, pre-OCR'd full text (1.2 MB, Tesseract Sanskrit+English). English and transliterated text good; Devanagari poor — which is fine, we use the metadata not the script. **CC BY 4.0** | Parse **~120 formulations** for the demo; target 600 only if ahead of schedule |
| **Ayurvedic Pharmacopoeia of India** — `pcimh.gov.in` / Archive fallback | Dravya monographs → graph nodes with Latin binomials | **Unverified.** `cdn.ayush.gov.in` did not resolve on 2026-09-10. Day-1 task for Himanshi | Target **~100 monographs**. If unavailable, AFI alone suffices for the seed |
| **Patent Office Journal** — `ipindia.nic.in`, weekly PDF | **Prahari's primary stream.** Every application published under Section 11A | **Semi-clean.** Consistent weekly format: application no., filing date, title, IPC, applicant, abstract, claim count. Large PDF, needs a parser | **~8 recent issues** for the demo; weekly thereafter |
| **Draft Guidelines for AYUSH patent applications** — IP Office, 5 Feb 2025 | Grounds the patent verdict and Examiner View | **Clean**, single PDF. **Status is draft** — Himanshi confirms whether finalised; labelled draft in the UI until then | 1 document → ~60 chunks |
| **Google Patents Public Data** — BigQuery `patents-public-data` | **[STRETCH]** Prahari's foreign stream | **Clean, structured.** Sandbox free, no credit card. Caveat: 60-day table retention | Week 4 only if ahead → ~5,000 records |
| **POWO / IPNI** + **GBIF** | Botanical synonym resolution for Prahari | **Clean JSON APIs** | ~50–200 lookups, cached locally |
| **BhashaBench-Ayur** — HuggingFace `bharatgenai/BhashaBench-Ayur` | **External benchmark.** Evaluation only — never training | **Clean.** 14,963 validated exam questions, English + Hindi | Sample **~300 questions** for the reported number |
| **Bhashini / ULCA** | Translation and ASR | API, not a dataset | N/A |
| **FSSAI Ayurveda Aahar Regulations 2022** | Food-category branch of the classifier | Single regulation PDF, reasonably clean | **~200 chunks** + profile fields |
| **NBA / ABS materials** — `nbaindia.org` | ABS obligation profile fields | **Messy PDFs**, inconsistent | **Not ingested as a corpus.** Hand-curated into ~30 profile rows |
| **GI Registry** | GI eligibility for the cultivator view | PDF journals, no API | **Hand-curated list of ~20 Ayurveda-relevant GIs.** Not scraped |
| **Landmark case law** | Grounding the Sec 3(p)/3(e) Examiner View | Manual | **6 hand-picked cases** (turmeric, neem, Basmati, and three Indian 3(p)/3(e) decisions) |

### 4.2 NOT USING — and why

| Source | Why not |
|---|---|
| **TKDL** (`tkdl.res.in`) | NDA-gated, no API, no bulk export. **Cannot be used by anyone**, including teams who will claim they did. We ship the adapter interface instead |
| **IP India InPASS / trade marks / designs** | No official API; scrape-only and fragile. Nothing on the demo path needs live IP India data. Listed as a post-SIH connector |
| **Indian Kanoon full corpus** | Token-gated and far larger than we need. Six hand-picked cases give the same grounding at 1% of the effort |
| **e-Charak / FRLHT medicinal plants DB** | Registration-gated, and POWO + GBIF already cover the taxonomy we need |
| **EPO OPS · PatentsView · Lens.org · PATENTSCOPE** | Redundant with BigQuery for a 5,000-record demo. Documented as the scale-out path, not built |
| **AyurParam-2.9B** (`bharatgenai/AyurParam`) | A domain fine-tuned LLM, interesting but orthogonal — we are retrieval-grounded, and hosting it needs GPU we do not have. Noted as a future comparison baseline |
| **Devanagari OCR of classical ślokas** | A two-week project on its own, and Sanskrit OCR on colonial-era scans is genuinely poor. **The Formulary already carries the source citation** (text, section, chapter, verse), so we render *"Sharangadhara Samhita, Madhyama Khanda 7/40–43"* without OCR'ing a single Devanagari character. ~90% of the credibility at ~10% of the cost. Displaying śloka text is roadmap |
| **Paid registry subscriptions** | ₹0 budget. We build the consent ledger and permission flow and demo it against a **mock** connector, and say so plainly. A working consent mechanism with no paid source behind it is honest; a fake integration is not |

### 4.3 Total data footprint

| Item | Count | Storage |
|---|---|---|
| Text chunks (statutes + treaties + FSSAI + AFI) | ~11,500 | ~40 MB |
| Embeddings (bge-m3, 1024-dim, float32) | ~11,500 | ~47 MB |
| Patent records (metadata + abstract + claim 1) | ~5,000 | ~20 MB |
| Graph nodes (demo seed) | ~150 | negligible |
| Graph edges | ~600 | negligible |
| **Total** | | **~110 MB** |

Supabase free tier allows 500 MB. **We use roughly a fifth of it.** This is deliberately a small database — the plan reads large only if you confuse *listing sources* with *needing them*.

---

## 5. Architecture

```
INGESTORS  (GitHub Actions cron)
  India Code mirror · WIPO Lex · AFI/API · FSSAI · AYUSH patent guidelines
  Patent Office Journal (weekly) · POWO/IPNI/GBIF · [stretch] Google Patents BigQuery
        │
        ▼
NORMALIZER → entity/relation extraction (LLM structured output, NLI-verified)
        │
        ▼
STRUCTURED STATE  (Supabase Postgres — one free tier)
  ├─ nodes / edges          knowledge graph, recursive CTEs
  ├─ formulation_dossier    the twin; also the Prahari subscription
  ├─ pgvector               versioned chunks
  ├─ regulatory_profiles    rules as versioned data (§7)
  ├─ corpus_version         hash, effective_from/to, source_url
  └─ audit_log / consent    DPDP surface
        │  ▲
        ▼  │
AGENT LAYER  (FastAPI + LangGraph, Python, HF Spaces free CPU)
  ├─ Orchestrator + Depth Controller  → QUICK / GUIDED / DEEP  (auto-triage)
  ├─ Sahayak:  Classifier → Obligation Planner → IP Map → Examiner View (gated)
  ├─ Prahari:  Journal sweep → Species resolver → Claim NLI → Window → Form 7A
  │              ↑ fired by a scheduler, never by a query
  └─ Shared:   Hybrid retriever → Reranker → Generator → Verification Agent (NLI) → Abstention gate
        │
        ▼
Answer + citations + calibrated confidence + corpus version stamp + reasoning trace
   (or a logged abstention → human IP facilitator)
        │
        ▼
Next.js:  Dossier workspace · IP Map · Cytoscape graph · jurisdiction toggle · /evals
```

### Tech stack

| Layer | Choice | Note |
|---|---|---|
| Frontend + BFF | Next.js API routes, shadcn/ui, Tailwind, Vercel hobby | Reused unchanged |
| Data + auth | Supabase — Postgres, pgvector, auth, realtime, RLS | Reused unchanged |
| Agent runtime | **FastAPI + LangGraph (Python) on HF Spaces free CPU** | New service, same repo, `services/brain`. Hosts bge-m3 + NLI locally so API quota is never spent on scoring |
| Graph store | Supabase `nodes`/`edges` + recursive CTEs; Cytoscape.js viz | **Neo4j dropped** — 150 nodes does not need a graph database |
| Voice | **Bhashini ASR** | **Vapi dropped** — Bhashini is named in the PS |
| Observability | **Langfuse free cloud** | Tracing, prompt versioning, eval datasets |
| Guardrails | **NVIDIA NeMo Guardrails** (open source) | Topical + safety rails, plus an output rail blocking uncited legal claims |
| LLM | Gemini Flash primary; Groq / OpenRouter free fallbacks behind a **router** | Cost story and demo-day insurance |
| CI | GitHub Actions | Nightly corpus diff + eval regression gate |

### Models (all free)

| Model | Role |
|---|---|
| `BAAI/bge-m3` | Multilingual dense retrieval — primary embedder |
| `BAAI/bge-reranker-v2-m3` | Cross-encoder reranker — **used off the shelf and evaluated, not fine-tuned** |
| `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` | **The ML core.** One model, three jobs: citation-faithfulness scoring, Prahari's claim-vs-prior-art entailment, attack-mode objections. CPU-runnable |
| `ai4bharat/indictrans2-*` | Translation fallback if Bhashini stalls |
| Trained in-house #1 | **Formulation classifier** — 6 classes, logistic head over bge-m3 embeddings, labels bootstrapped from AFI + rules. ~6 hrs. Load-bearing: it is the routing decision |
| Trained in-house #2 | **Calibrated abstention gate** — logistic/GBM over retrieval features (max cosine, reranker score, NLI entailment, source tier) predicting citation-faithfulness. Powers the PS's confidence indicator with a model instead of a heuristic. Yields a reliability curve and **ECE**. ~8 hrs |

> **Deliberately not fine-tuning a reranker.** It costs 5–6 days, may lose to off-the-shelf `bge-reranker-v2-m3` (turning the headline into a negative result), and is invisible to judges. Measuring retrieval properly is the stronger signal at one-fifth the cost.

---

## 6. Knowledge graph

Deliberately small. ~150 nodes at demo seed, ~800 if we finish early.

**Nodes:** `Dravya` · `Formulation` · `TextReference` · `Statute` · `Provision` · `Treaty` · `TreatyArticle` · `Patent` · `GI` · `ABSObligation` · `RegulatoryCategory` · `Jurisdiction` · `Taxon`

**Edges:** `CONTAINS` · `CITED_IN_TEXT` · `GOVERNED_BY` · `BARRED_BY` · `REQUIRES` · `TRIGGERS_ABS` · `CLAIMS_USE_OF` · `ANTICIPATED_BY` · `SYNONYM_OF` · `AMENDED_BY`

Stored as `nodes(id, type, props jsonb)` and `edges(src, dst, type, props jsonb, confidence, provenance)`.

**Every edge carries provenance (the source chunk id) and confidence. Nothing enters the graph without a citable source** — the same rule the product enforces on its own answers.

The graph is what upgrades an answer from generic to specific: *"your formulation contains Withania somnifera → 3 ABS obligations → 2 GI conflicts → 41 global filings citing it."*

---

## 7. The regulatory-profile engine

Market-access and obligation rules are **finite, structured and decision-shaped** — six markets × ~14 decision-relevant facts each is ~84 facts. Retrieving free text to re-derive the same 84 facts on every query is slower, less reliable, and impossible to evaluate deterministically.

So they become **typed, cited, versioned data**, extracted once at build time by an LLM reading the source regulation and verified by a human:

```yaml
market: EU
route: traditional_herbal_registration
evidence_years_required: 30        # 15 of which within the EU
dossier: [quality, safety, bibliographic_efficacy]
clinical_trials_required: false
permitted_claims: [traditional_use_only]
prohibited_claims: [disease_treatment]
authority: national_competent_authority
form: {id: ..., url: ..., attachments: [...]}
citation: "Directive 2004/24/EC, Art. 16c"
verified_by: himanshi
verified_on: 2026-09-15
corpus_version: 2026-09-10
```

At runtime the engine **matches the dossier against the profile and returns a gap analysis** — what you have, what is missing, what disqualifies you. The LLM never decides the law; it only explains the gap in plain language.

**Why this is the better engineering answer:**
- Deterministic and unit-testable. No LLM variance, no hallucinated requirement.
- **The same schema powers national obligations and international market access.** One engine, two jobs — less code, not more.
- Adding a market is a data file, not a code change. That is the scalability story.
- The `form` field satisfies the PS line *"move from a question to the right registry, record or form."*
- Every field carries its citation and its human verifier.

**Scope:** ship **US and EU fully verified**; leave the other four as schema-valid stubs **marked `unverified` in the UI**. A system that knows which of its own knowledge is unverified is stronger than one pretending all six are done.

---

## 8. Evaluation

The PS names its own four axes. We report exactly those, on a live `/evals` page in the product.

### 8.1 Gold set — generated backwards from the source

Do not write a question then hunt for its answer. **Start from a statute chunk and generate the question it answers.** The ground-truth span is then guaranteed by construction.

This inversion yields a **retrieval gold set for free** — every question ships knowing which chunk should have been retrieved, so nDCG@10 and recall@20 are computable without anyone labelling relevance. Hand-written questions give an answer set only, and no retrieval metrics at all.

Three legs:

1. **Synthetic, span-anchored (~200 Q)** — generated from chunks, stratified across the 6 categories and 7 IP regimes, plus ~40 deliberately out-of-scope questions for abstention.
2. **Human-verified sample (~60 Q)** — Himanshi verifies a stratified sample, not all 200. Verification is a far easier task than authoring, and it is what she can actually deliver. **Report the sample's error rate as the quality bound on the whole set** — statistically legitimate, one-third the work.
3. **External benchmark (~300 Q from BhashaBench-Ayur)** — someone else's test, which we cannot accidentally overfit to.

### 8.2 Metrics

| PS axis | Our measure | Method |
|---|---|---|
| **Answer accuracy** | Gold set + BhashaBench-Ayur | LLM judge, **calibrated against human labels with Cohen's κ reported** |
| **Citation correctness** | Citation faithfulness + hallucinated-authority rate | Per-sentence NLI entailment against the cited span; separately, does the cited section exist and say what was claimed |
| **Safe abstention** | Precision on the out-of-scope subset; **ECE** | Trained gate + reliability curve |
| **Multilingual quality** | Per-language delta vs. English | Translated subset |
| *(supporting)* | Retrieval nDCG@10 / recall@20 | Three-way bake-off: BM25 · hybrid · hybrid+rerank |
| *(supporting)* | Prahari precision@20 | Human review of top-ranked candidates |
| *(supporting)* | **Depth-routing accuracy** | ~30 queries labelled with their correct tier. A QUICK query that triggers DEEP is a cost bug, not just latency |
| *(supporting)* | **Window-computation correctness** | Unit tests against hand-checked Journal entries, including one already granted and one early-published |

**No target numbers appear anywhere in this document by design, and none may appear on a slide.** Report measured values only. A measured 0.71 with an error analysis beats a claimed 0.90 without one, and it is the only version that survives Q&A.

**LLM-as-judge calibration is non-negotiable** — an uncalibrated judge is a vibe with a number attached. Compute κ against at least 50 human-labelled answers before trusting it for any reported figure.

---

## 9. LLMOps — the Corpus Time Machine

The PS says "keep its corpus current as the law changes." Cheap to build, impossible to fake, and the best LLMOps story available here.

- Every document is version-tracked: content hash, `effective_from` / `effective_to`, source URL, fetch timestamp.
- A nightly GitHub Actions job re-fetches sources and diffs them.
- On detected amendment: re-embed **only affected chunks**, bump the corpus version, and **re-run the eval suite as a regression gate**.
- Every served answer is linked to the corpus version that produced it — so the system can tell a past user *"3 of your saved answers are now stale."*

Everything traced in Langfuse; prompts versioned there rather than in code.

---

## 10. Security, privacy, standards (Saima's lane)

- **Supabase RLS** on every table; dossiers private by default.
- **Append-only audit log** — query, retrieval set, model version, corpus version, answer. Any answer reconstructible after the fact.
- **Consent ledger** — the PS requires paid subscriptions be touched only with explicit, logged permission. First-class table: grant, scope, expiry, revocation, per-access log. Demoed against a mock connector.
- **DPDP posture** — data minimisation, purpose limitation, retention windows, export and erasure endpoints.
- **NeMo Guardrails** — topical rail (refuse off-domain), safety rail, and an output rail that **blocks any uncited legal claim** and appends the standing "information, not legal advice" disclaimer.
- **Abstention → escalation** — below the calibrated threshold, refuse, log, and route to a human IP facilitator.
- **Standards mapping** — one page mapping guardrails, eval harness, audit log and abstention design onto the **NIST AI Risk Management Framework**. The PS says "recognised AI-application standards"; this answers it verbatim. ~2 hours.

---

## 11. Multilingual

Bhashini primary (ASR, NMT), IndicTrans2 fallback. **Scope: Hindi committed, two more languages if ahead.** Eleven is not honest at this capacity.

**The design detail that shows legal literacy:** translate the question in and the answer out, but **never translate the citation**. Statutory text stays in its authentic form with a translated gloss beside it — because a translated statute is not the statute. Retrieval runs in English with translated queries; per-language quality is measured and reported.

---

## 12. Schedule — 4 weeks

**Prahari is built in week 2, not week 3.** This is deliberate and counterintuitive: build the differentiator early and let the commodity features absorb any slip. If you run out of time, you want to be missing breadth, not missing the thing that wins.

### Week 1 — Foundation and grounded retrieval
Supabase schema + RLS · corpus ingestion from the India Code mirror · chunking + embeddings · hybrid retrieval + rerank · grounded generation with mandatory citations · **Orchestrator + Depth Controller skeleton** · **Verification Agent as its own node** · jurisdiction toggle · minimal eval harness (50 questions, faithfulness + accuracy) · Langfuse wired · Bhashini registration started · Himanshi's source verification.

**Cut-line: it answers IP questions with citations, and you can measure it.**

### Week 2 — Prahari thin slice
AFI Part I parsed → ~120 formulations into the graph · **Patent Office Journal parser** (~8 recent issues, IPC `A61K36`) · species resolution via POWO/IPNI · NLI claim matching · **opposition-window computation** · urgency ranking · **Form 7A representation generator**. **Manual trigger is acceptable this week.**

**Cut-line: it finds a real published application, computes how many days remain before it can be granted, and drafts a real Form 7A. The USP, secured.**

### Week 3 — The advisory product
IP Protection Map across all 7 regimes · trained formulation classifier · regulatory-profile engine (US + EU verified, four stubs) · obligation planner + ABS · Examiner View (gated to "may be open" verdicts) · cultivator view · form pointers · Cytoscape graph viz.

**Cut-line: the complete PS answer.**

### Week 4 — Automation, language, hardening
Prahari scheduler + push notification + national watchlist · **[stretch] foreign stream via BigQuery** · calibrated abstention gate · eval depth (200 synthetic + 60 verified + BhashaBench) · corpus diff CI · Hindi via Bhashini · NIST AI RMF mapping · **offline demo mode** · UI polish · buffer.

### Demo, frozen to three moments
1. Formulation in → IP Protection Map → *"patent barred, five doors open."*
2. Last night's Prahari alert → the generated dossier PDF.
3. The `/evals` page.

Everything else is a slide, not a click. Teams lose by trying to show everything and landing nothing.

---

## 13. Cut list

**Cut outright:** label-compliance vision scanner (capacity) · Devanagari OCR · export-market retrieval corpus (replaced by profiles) · Neo4j · case-law ingestion pipeline · IP India scraping · e-Charak.

**Roadmap slide — said aloud, never built:** real TKDL behind the existing adapter · full śloka display · form pre-fill to PDF · Telegram/WhatsApp reach for cultivators · EPO OPS + PatentsView at scale · paid registry connectors · languages beyond Hindi.

Naming what you deliberately did *not* build reads as judgement, not as a gap.

---

## 14. Risks

| Risk | Mitigation |
|---|---|
| **Capacity — 196 hrs is tight** | Prahari in week 2; commodity features absorb slippage; every week has a cut-line |
| **Dia is a single point of failure** | Eval harness is the most precisely specifiable component → built by Claude Code agents from a spec, not by hand |
| **API (Pharmacopoeia) source unverified** | Day-1 task. AFI Part I alone suffices for the graph seed if API is unavailable |
| **AFI OCR quality on Devanagari** | We use metadata and transliterated text, not Devanagari script. Design already avoids the weak part |
| **Patent Office Journal PDF parsing** | Bounded: consistent weekly format, and only ~8 issues are needed for the demo. Verify the IPC field appears as expected before building on it |
| **AYUSH guidelines are draft, not final** | Labelled "draft guidance" everywhere in the UI until Himanshi confirms. Presenting draft guidance as law would break the product's own premise |
| **BigQuery 60-day retention** *(stretch stream only)* | Export to Supabase immediately; never depend on stored BigQuery tables |
| **Bhashini registration latency** | Started week 1; IndicTrans2 fallback already in the stack |
| **Demo-day network failure** | Offline mode with cached responses and a pre-computed watchlist. Full rehearsal with the network disabled, twice |
| **Weak eval numbers invert the narrative** | Report measured values with error analysis. Never put a target on a slide |
| **Prahari legal exposure** | §2.3 framing is mandatory, not optional |
| **Overclaiming in the deck** | Every statutory citation verified by Himanshi against India Code before it reaches a slide |

---

## 15. Resume value

Fill from actual runs. **Never ship a number you did not measure.**

- Built a 2-agent LangGraph system over a version-tracked corpus of ~11.5k chunks spanning 15 Indian statutes and 8 international instruments.
- Generated a span-anchored evaluation set that yields retrieval ground truth by construction, enabling nDCG@10 and recall@20 without manual relevance labelling.
- Calibrated an LLM judge against human labels (κ = _) before trusting it for any reported metric.
- Trained a calibrated abstention classifier (ECE = _) that gates unsupported answers at an _% abstention rate.
- Raised citation faithfulness from _ to _ using NLI-based entailment scoring; hallucinated-authority rate _.
- Screened ~5,000 global patent records (CPC A61K36) against a ~150-node Ayurvedic prior-art graph with botanical synonym resolution; surfaced _ candidates with auto-drafted prior-art dossiers.
- Nightly corpus-diff pipeline with eval-regression CI, flagging stale answers on statutory amendment.

**JD mapping:** production RAG · agent orchestration (LangGraph) · evaluation and guardrails · hybrid retrieval · knowledge graphs · LLMOps and observability · model routing · supervised training and **calibration** · multilingual NLP · Python + TypeScript · cloud deployment.

The calibration work and the eval methodology are what separate this from the API-wrapper projects that dominate entry-level portfolios.

---

## 16. Verification

- **Weekly gates:** each week ends with the eval suite run and `/evals` updated. A week is not done until its metrics are on the page.
- **Retrieval:** the three-way bake-off must be reproducible from a single command.
- **Faithfulness:** NLI scoring over the full gold set; every failure case inspected by hand at least once.
- **Judge calibration:** κ computed against ≥50 human-labelled answers before any reported number.
- **Guardrails:** an adversarial prompt set (jailbreaks, requests for legal advice, out-of-scope, fabricated-statute bait) run in CI. Zero uncited legal claims may escape the output rail.
- **Prahari:** top-20 candidates reviewed by hand; at least one dossier read end to end against the actual published application to confirm the citations say what the dossier claims.
- **Legal framing:** grep the entire user-facing string set for "biopiracy", "misappropriation", "stolen", "theft". Zero hits permitted.
- **Demo:** full run-through in offline mode with the network disabled, twice, before the pitch.

---

## Appendix — standing rule

Every statutory reference in this document is a **pointer for verification against India Code**, not an authority. The product's premise is that it never fabricates authority; the plan must hold itself to the same standard before a single section number reaches a slide.
