# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Summary

SAMHITĀ (संहिता) is the team's implementation of *IP-SAKTI Sahayak* for SIH 2026, Problem Statement 26045 (Ministry of AYUSH / All India Institute of Ayurveda). It is a single knowledge graph with two agentic RAG systems on top: **Sahayak**, which builds an "IP Protection Map" for a user's Ayurvedic formulation across all seven Indian IP regimes (patent, trademark, GI, copyright, design, trade secret, plant variety); and **Prahari**, an unprompted watcher that sweeps the weekly Patent Office Journal for foreign filings that may anticipate Indian traditional knowledge and drafts pre-grant opposition dossiers. The build is scoped to ₹0 budget (free tiers only) and ~196 person-hours over 4 weeks. There is no bare chat box — the primary interaction unit is a persistent **Formulation Dossier** object.

## 2. Architecture

Source of truth: `docs/Ip_sakti_architecture.jpeg`. Described top to bottom as drawn:

1. **User Query** (text / voice / dossier, any language) enters the **Orchestrator Agent**, which extracts intent/entities and routes.
2. **Query Triage & Depth Controller** picks one of three tiers automatically (never asked upfront): **Quick Answer** (direct, minimal retrieval), **Guided Analysis** (agents + more context, e.g. "show IP protection map"), **Deep Research** (full agentic RAG + external tools, e.g. "find similar patents globally").
3. All three tiers feed into an **"Agents & Tools (Activated as needed)"** row containing three separate agents, drawn side by side with connecting arrows: **Sahayak Agent** (formulation classifier, regulatory obligations, attack-mode/examiner view), **Prahari Agent** (species/synonym resolution, claim matching, risk assessment), and **Tool Agents** (taxonomy tools, regulatory APIs, web search, translation) — three distinct agents, not one agent with sub-features.
4. These feed a **Retrieval Layer (Deterministic)**: **Vector/Keyword Search** (BM25 + vector, structured + unstructured sources) and **Knowledge Graph** (dravya/herb/formulation entities, patents/prior art/taxonomy), drawn with a bidirectional arrow between them.
5. **Combined Context** merges and deduplicates/ranks the retrieved text + graph results.
6. **LLM (Reasoning & Generation)** reasons over context and drafts the answer + next steps.
7. **Verification Agent (Deterministic)** checks faithfulness/citations (NLU) and safety/legal guardrails, then branches: **Confidence OK → Final Answer** (grounded, cited, actionable, with resource links) or **Confidence Low → Abstain / Human Review** (clarifying questions or escalation to a human expert).
8. Both branches write to **Dossier Memory / State** (saves the interaction, derived facts, updates the knowledge graph), which loops back ("update context for future queries") into the top of the flow for the user's next query.
9. Off to the side: **Multilingual** (EN/HI/Sanskrit/other) attaches to the User Query box as an input capability, not a separate pipeline stage.

**Flag — interpret with care, don't take as settled:**
- The top-left callout box ("System gives the right depth answer — no unnecessary heavy research") appears to be an annotation on the Depth Controller rather than a real data-flow edge — don't implement it as a pipeline step.
- `SAMHITA-PLAN.md` §2.1 describes Sahayak and Prahari as two independent entry points into a *shared* deterministic retrieval/generation/verification pipeline (Prahari fires from a Friday scheduler, "never in the query path," not from a live call by Sahayak). The image draws Sahayak, Prahari, and Tool Agents as three separate agents connected within the same "Agents & Tools" layer — confirmed as three distinct agents (not sub-features of one agent), but exactly what the connecting arrows between them represent at runtime (direct agent-to-agent calls vs. shared access to the same tool substrate) isn't settled by the image alone — check before wiring a direct Sahayak↔Prahari call path.

## 3. Tech Stack

From `SAMHITA-PLAN.md` §5 ("Tech stack" table) and the models table:

| Layer | Choice |
|---|---|
| Frontend + BFF | Next.js API routes, shadcn/ui, Tailwind, deployed on Vercel hobby tier |
| Data + auth | Supabase (Postgres, pgvector, auth, realtime, RLS) |
| Agent runtime | FastAPI + LangGraph (Python), hosted on HF Spaces free CPU, service path `services/brain` |
| Graph store | Supabase `nodes`/`edges` tables + recursive CTEs; Cytoscape.js for visualization (no Neo4j) |
| Voice / language | Bhashini ASR (named in the PS); IndicTrans2 as fallback |
| Observability | Langfuse (free cloud) — tracing, prompt versioning, eval datasets |
| Guardrails | NVIDIA NeMo Guardrails (topical + safety rails, output rail blocking uncited legal claims) |
| LLM | Gemini Flash primary; Groq / OpenRouter free tiers as router fallbacks |
| CI | GitHub Actions — nightly corpus diff + eval regression gate |
| Models | `BAAI/bge-m3` (embeddings), `BAAI/bge-reranker-v2-m3` (reranker, off-the-shelf), `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` (NLI — citation faithfulness, Prahari entailment, attack-mode), `ai4bharat/indictrans2-*` (translation fallback), plus two in-house trained models: a formulation classifier and a calibrated abstention gate |

## 4. Design System & Skills

- Use the `impeccable` skill for **all** UI work.
- Before making UI changes, read `.impeccable/hook.cache.json` and stay consistent with prior findings. It currently records edits to `docs/samhita-lanes.html` with three unresolved low-contrast findings (text colors `#7c8a85`, `#a3b0ab`, `#e4ebe7` on white — all below 4.5:1) — don't reintroduce those contrast ratios in new UI.
- Use the Figma MCP server for design context when building or syncing UI.
- Use the Playwright MCP server to verify UI behavior after each feature is built (not just unit tests).

## 5. Build Plan Reference

The full phase-by-phase, member-by-member task breakdown lives in `docs/SAMHITA-PLAN.md` (Weeks 1–4, §12, plus ownership in §3). Treat it as the authoritative execution plan — don't duplicate its task list here; read it directly before starting any lane of work.

## 6. Conventions

- Agent runtime code lives under `services/brain` (FastAPI + LangGraph), per §5 architecture diagram in the plan.
- Regulatory/market-access rules are stored as typed, versioned YAML-like data (see plan §7 example), not re-derived from free text at query time — a market is added as a data file, not a code change.
- Testing/eval approach is specified explicitly in the plan (§8, §16): a live `/evals` page reporting the PS's four named axes (answer accuracy, citation correctness, safe abstention, multilingual quality); gold-set questions are generated backwards from source chunks so retrieval ground truth is guaranteed by construction; every week/phase ends with the eval suite run and `/evals` updated — a week isn't done until its metrics are on the page; unit tests required specifically for opposition-window date math (§8.2, "Window-computation correctness"); an adversarial guardrail prompt set runs in CI with zero uncited-legal-claim escapes permitted.
- No naming/folder conventions beyond the above are specified anywhere yet — none invented here.

## 7. Current Status

**Frontend (mocked backend) is built.** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, at the project root, with a full mock data/service layer (`src/lib/api.ts` + `src/lib/mock/*`) standing in for `services/brain` and Supabase. No real backend, model calls, or data ingestion exist yet — this is a hackathon-demo frontend only, per explicit scope.

Routes built and Playwright-verified (no console errors, no dead links, full-width responsive at 390/1440/3840 CSS px): `/` (Overview), `/ask`, `/dossiers` + `/dossiers/[id]`, `/prahari` + `/prahari/[id]`, `/graph`, `/evals`, `/settings`. Notable behaviors: New Dossier creation and dossier renaming (both localStorage-backed); the Ask tab is a two-agent chat (Sahayak/Prahari) with a live-updating dossier/search-progress panel, per-answer citations with a collapsed-by-default eval-score reveal, a deliberate abstention scenario, and an end-of-session evaluation report; Prahari has a "run watchlist sweep" live progress simulation naming the sources it checks; a global footer (About Us + contact) renders on every page.

**Design system**: earthy Ayurvedic palette (warm cream ground, soil-brown + deep-red primary/agent colors, sage-green secondary agent color, ochre for draft/unverified), EB Garamond + Lato + IBM Plex Mono, `.glass` (frosted/translucent) treatment on the chat panel and a few key cards only — never on dense tables. Tokens live in `src/app/globals.css`; the design rationale and revision history are in `.impeccable/surfaces/app.md`. This superseded an earlier navy/paper "statute register" direction that user-tested as too cold/generic — kept here as a reminder not to re-introduce it.

Per the plan's Week 1–4 schedule (§12), all real backend work is still pending:
- **Week 1** (foundation + grounded retrieval): not started.
- **Week 2** (Prahari thin slice): not started.
- **Week 3** (advisory product / IP Protection Map): not started — frontend shell for it exists, logic does not.
- **Week 4** (automation, language, hardening): not started.

Also outstanding: `docs/briefs/` is empty, but the plan (§1.2) requires explicit written briefs for Vansh (deck) and Himanshi (research) before their lanes can proceed — these haven't been produced yet.

**Next for the frontend**: wire the mock service layer's functions in `src/lib/api.ts` to the real FastAPI backend once it exists (each function's signature is meant to stay stable across that swap); everything else in this section is otherwise demo-complete.

## 8. Do / Don't

- **Don't** depend on TKDL — it has no public API and is NDA-gated. **Do** build against the documented `PriorArtSource` interface with the open Formulary/Pharmacopoeia surrogate as the real implementation and a stubbed `TKDLAdapter`.
- **Don't** ever call a named foreign entity a "biopirate," or use "misappropriation"/"biopiracy" in user-facing output. **Do** phrase Prahari output as "prior art potentially relevant to this application."
- **Don't** auto-file or auto-publish anything from Prahari. **Do** require mandatory human review before any output leaves the system.
- **Don't** present the AYUSH draft patent guidelines as settled law. **Do** label them "draft" in the UI until Himanshi confirms finalization.
- **Don't** translate statutory citations. **Do** translate the question and answer, but keep citations in their authentic form with a translated gloss alongside.
- **Don't** put target/goal numbers on slides or in reports. **Do** report only measured values, with error analysis.
- **Don't** reintroduce Neo4j — it was deliberately dropped; the graph is small enough for Supabase `nodes`/`edges` + recursive CTEs.
- **Don't** fine-tune the reranker — deliberately out of scope (§5 note); use `bge-reranker-v2-m3` off the shelf and evaluate it instead.
- **Don't** add paid dependencies or scale-up infrastructure — ₹0 budget, free tiers only; paid scaling is a slide, never a dependency.
- **Don't** OCR Devanagari script for classical texts — deliberately cut; use the Formulary's existing citation metadata instead.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
