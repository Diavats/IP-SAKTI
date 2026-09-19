# ARCHITECTURE

Orientation file. Read this first in any new session. It covers what the system is, how the pieces
fit, where everything lives, and which rules cannot be broken.

For the phase-by-phase build plan see `docs/SAMHITA-PLAN.md`. For working conventions and settled
decisions see `CLAUDE.md`, especially §9.

---

## 1. What this is

**SAMHITĀ** (संहिता) is our implementation of *IP-SAKTI Sahayak* for SIH 2026, PS 26045, Ministry of
AYUSH and the All India Institute of Ayurveda.

One knowledge graph carries two agents. **Sahayak** maps a formulation's protection status across all
seven Indian IP regimes and returns an ordered filing sequence. **Prahari** reads the weekly Patent
Office Journal without being asked, finds applications that may anticipate Indian traditional
knowledge, computes how long the objection window has left, and drafts a Form 7A representation for
a human to review.

The unit of interaction is a persistent **Formulation Dossier**, not a chat box.

### The one sentence that explains the product

An application publishes under **Section 11A**. **Rule 55(1A)** bars any grant for six months after
that. Inside that window **Section 25(1)** lets *any person* object on **Form 7A**. Before grant,
stopping a bad patent costs a form. After grant it costs a lawsuit.

Everything else in the system exists to make sure that window is never missed.

---

## 2. Runtime architecture

Reference image: `docs/Ip_sakti_architecture.jpeg`. Note that it is being replaced by a newer version
from Devansh; see `docs/briefs/devansh-architecture.md` for the pending fixes.

```
  User query (text / voice / dossier, any language)
        │
        ▼
  Orchestrator            intent and entity extraction
        │
        ▼
  Depth Controller        QUICK  classifier + one retrieval pass
                          GUIDED + graph traversal + profile engine
                          DEEP   + external tools, multi-hop search
        │
        │                 Scheduler (Fridays) ──▶ Prahari
        │                 second entry point, never in the query path
        ▼                        │
  Agents and tools  ◀────────────┘
   Sahayak · Prahari · Tool agents
        │
        ▼
  Retrieval (deterministic)      BM25 + vector, and the knowledge graph
        │
        ▼
  Combined context               merge, deduplicate, rank
        │
        ▼
  LLM reasoning and generation
        │
        ▼
  Verification Agent (deterministic)   NLI entailment per sentence against the cited span
        │
        ├── confidence OK  ──▶ answer with citations and a corpus-version stamp
        └── confidence low ──▶ abstain, log, escalate to a human reviewer
        │
        ▼
  Dossier memory and state       feeds the next query
```

### Two things about this diagram that get asked every time

**Prahari is not in the query path.** It fires from a Friday scheduler. A user query never triggers
it. This is the whole differentiator, so if a diagram or a slide shows Prahari hanging off the Depth
Controller, that is a bug in the diagram.

**Five boxes say "Agent", the product has two.** Orchestrator, Sahayak, Prahari, Tool Agents and
Verification Agent all carry the word. Sahayak and Prahari are the two that produce user-facing
output. The other three are pipeline stages. Say so before anyone has to ask.

### Why verification is its own node

Putting "cite your sources" in a prompt means the model grades its own homework. Pulling verification
out as a separate deterministic node, which entailment-checks every generated sentence against the
span it cites, is what makes the citation guarantee real. It is the strongest architectural claim we
have.

---

## 3. Repo layout

```
ARCHITECTURE.md          this file, structure and invariants
CLAUDE.md                working conventions, and §9 settled decisions
PRODUCT.md               product definition, users, principles (impeccable schema)
README.md                how to clone and run what exists today

src/
  app/                   Next.js App Router pages and globals.css design tokens
  components/
    ui/                  shadcn/ui primitives
    ask/                 the /ask chat experience
    app-shell.tsx        sidebar, mobile nav, footer, wraps every page
  lib/
    api.ts               THE mock service layer, the one file to swap for a real backend
    mock/                fixture data api.ts reads from
    types.ts             domain model types
    labels.ts            enum to label maps

public/
  images/                logo and formulation photography
  video/                 intro video, web-encoded

docs/
  SAMHITA-PLAN.md        authoritative build plan, phases, ownership, data sources
  Ip_sakti_architecture.jpeg
  briefs/
    vansh-deck.md        slide-by-slide deck content
    devansh-architecture.md  pending fixes to the architecture diagram
    himanshi-research.md source verification, Part A done, Part B open

services/brain/          DOES NOT EXIST YET. FastAPI + LangGraph agent runtime goes here
```

### What is real and what is not

The frontend is built and Playwright-verified. Everything behind it is mocked. There is no
`services/brain`, no Supabase project, no model calls, no corpus ingestion. Every API call the UI
makes is served from memory by `src/lib/mock/*` behind `src/lib/api.ts`.

The signatures in `src/lib/api.ts` are the contract the real backend has to satisfy. Swapping mock
for real should mean editing that one file, not the pages that call it.

---

## 4. Invariants

These are not style preferences. Breaking one is a defect.

### Legal framing
Never call any party a biopirate. Never use "misappropriation", "biopiracy", "stolen" or "theft" in
user-facing output. Prahari's findings read as *"prior art potentially relevant to this
application"*. A Section 25(1) representation does not accuse anyone, it submits prior art for
examination, and that is both the safer framing and the legally correct one.

Nothing is auto-filed or auto-published. Human review is mandatory before any output leaves the
system.

### Citations
Every claim is a citation or an abstention. There is no third state where the UI asserts something
without a source or a confidence signal.

Statutory citations are never translated. Translate the question and the answer, keep the citation in
its authentic form with a gloss beside it, because a translated statute is not the statute.

The AYUSH patent guidelines are labelled **draft** until finalisation is confirmed.

### Honesty
Report measured values only, never a target, in the UI, in docs, or on slides. Where something has
not been measured, say so. The `/evals` page carries an "Illustrative values for this build" badge
and a "measured, not targeted" line on purpose. The multilingual card reads "Not yet measured,
scheduled Week 4". None of these are softened.

### Sources
TKDL has no public API and is NDA-gated to 17 patent offices. We ship a documented `PriorArtSource`
interface with a stubbed `TKDLAdapter`, and our live implementation uses the published Ayurvedic
Formulary and Pharmacopoeia, which are already-public government books, so we disclose nothing new.
Any claim of live TKDL access would be false.

### Scope
₹0 budget, free tiers only. No paid dependencies. No Neo4j, the graph is small enough for Supabase
`nodes`/`edges` with recursive CTEs. No Devanagari OCR, the Formulary already carries its source
citation. No reranker fine-tuning.

---

## 5. Status

Frontend complete against mocks. Routes: `/`, `/ask`, `/dossiers`, `/prahari`, `/graph`, `/evals`,
`/settings`. Chat is a slide-in panel state rather than a page.

Backend work has not started. Weeks 1 to 4 of `docs/SAMHITA-PLAN.md` §12 are all pending.

Current phase is the SIH idea submission. Deck content is written and sits in
`docs/briefs/vansh-deck.md`.

### Known open items

The architecture image needs the scheduler arrow fixed so Prahari stops reading as query-triggered.
See `docs/briefs/devansh-architecture.md`.

The ABS benefit-sharing slabs come from the Biological Diversity (Access and Benefit Sharing)
Regulations 2025, and are currently sourced from legal commentary rather than the gazette. Verify
before any rupee figure ships. See `docs/briefs/himanshi-research.md` Part B item 1.
