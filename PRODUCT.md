# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, per `CLAUDE.md` §3 (already a confirmed project decision, not delegated here). This build phase (frontend only, hackathon internal-round demo) runs against a hand-built mock data/service layer standing in for the real FastAPI + LangGraph + Supabase backend described in `CLAUDE.md`/`docs/SAMHITA-PLAN.md` — swapping in the real backend later is meant to be a change to that one service layer, not a rewrite.

## Users

*[Inferred from `docs/SAMHITA-PLAN.md`, not confirmed by live interview this session.]*

- **Formulation owner** (Ayurvedic MSME, manufacturer, or cultivator) who needs to know, before spending money on legal counsel, which of the seven IP regimes are actually open for their formulation, and what obligations (licensing, ABS, labelling) attach to it.
- **Cultivator** persona specifically named in the source problem statement: "I grow X in district Y" → GI eligibility / ABS posture / PPV&FR route.
- **Ministry-side IP facilitator / AIIA admin** who reviews low-confidence (abstained) answers and reviews/files Prahari's drafted pre-grant oppositions — human review is mandatory before anything Prahari drafts leaves the system.

## Product Purpose

SAMHITĀ answers the two clauses of PS 26045 at once: Ayurvedic innovation is under-protected/under-commercialised (Sahayak's IP Protection Map), and Indian traditional knowledge is exposed to misappropriation abroad (Prahari's unprompted patent watch). Success is measured on the PS's own four named axes — answer accuracy, citation correctness, safe abstention, multilingual quality — reported on a live `/evals` page, not asserted.

## Positioning

Not a chatbot wrapper over statutes. Two differentiators a generic RAG-over-law tool could not truthfully copy: (1) the IP Protection Map is generated from a small curated knowledge graph plus a regulatory-profile engine, so it maps a specific formulation's dravya list to specific barred/open verdicts with section-level citations, not generic guidance; (2) Prahari is agentic in the literal sense — it acts unprompted on a schedule, holds state, diffs against it, and produces a filing-ready artifact (a Form 7A dossier), not a reply to a question anyone asked.

## Operating Context

- The unit of interaction is a persistent **Formulation Dossier** (dravya list, sourcing, claimed indication, target market, classical text reference), not a bare chat box.
- Every query is auto-triaged into one of three depth tiers (Quick / Guided / Deep) by the Orchestrator + Depth Controller — the user is never asked which depth they want up front; escalation is offered under the answer instead.
- Prahari's sweep is a second, independent entry point (a Friday scheduled job against the Patent Office Journal), never triggered by a live user query.
- Jurisdiction (India vs. international) is toggled explicitly and kept in visibly separate answer sets — a translated statute or a foreign-jurisdiction answer is never silently blended with the Indian one.
- Draft/unverified regulatory sources (the AYUSH draft patent guidelines; four of six international market profiles) must be visibly labelled as draft/unverified in the UI, per `CLAUDE.md` §8.

## Capabilities and Constraints

- **Confirmed for this build phase:** frontend only, full client-side routing across the workflow stages below, mocked backend behind real-shaped async service calls, no dead-end nav items or buttons.
- **Undecided / explicitly out of scope for this phase:** real corpus ingestion, real Supabase schema/RLS, real model calls (classifier, NLI verification, abstention gate), real Bhashini integration, real Prahari scheduler.
- **Hard product constraints carried into UI copy** (from `CLAUDE.md` §8 — do not violate when writing any label, toast, or empty state): never call a named foreign filer a "biopirate" or use "misappropriation"/"biopiracy" in user-facing copy — Prahari output reads as "prior art potentially relevant to this application"; never imply auto-filing or auto-publishing; never translate a statutory citation; never state a target/goal number, only measured values.
- Terminology to use consistently: **Sahayak** (सहायक, IP guidance agent), **Prahari** (प्रहरी, watcher agent), **Formulation Dossier**, **IP Protection Map**, **Examiner View** (gated — fires only when the patent verdict is "may be open"), **Obligation Planner**, **Cultivator View**.

## Brand Commitments

Product and agent names are fixed and carry Devanagari alongside the Latin transliteration wherever first introduced in the UI (SAMHITĀ / संहिता, Sahayak / सहायक, Prahari / प्रहरी) — this is a stated legal-literacy/cultural-grounding detail in the source plan, not decorative. No logo, color system, or other visual identity exists yet; none is assumed here.

## Evidence on Hand

No real screenshots, mockups, user data, or content exist yet. `docs/samhita-lanes.html` is an internal team task-lane page (member-wise work split), not a product UI reference, and carries known unresolved contrast issues (see Accessibility below) — it must not be treated as visual precedent. `docs/Ip_sakti_architecture.jpeg` is a system-architecture diagram, not a visual/UI reference. All formulation, dossier, patent, and eval-metric content in this build is placeholder/mock data, explicitly marked as such in code.

## Product Principles

1. Depth is decided by the system, never asked upfront — the UI defaults to the fastest useful answer and offers escalation, rather than gating on a question most users can't answer yet.
2. Every claim is a citation or an abstention — there is no third state where the UI states something as fact without a source or a confidence signal.
3. Prahari's output is an artifact, not a reply — its surface is a dossier/watchlist a human reviews and acts on, not a chat transcript.
4. Legal framing is load-bearing, not a copy nicety — accusatory language is a liability bug, not a tone preference.
5. The system is honest about what it doesn't know yet — draft guidance, unverified profiles, and (in this build phase) mocked data are always visibly labelled, never presented as settled.

## Accessibility & Inclusion

No formal standard was specified for this project. Carry forward one concrete known constraint: prior Impeccable findings on this project (`.impeccable/hook.cache.json`) flagged three text/background pairs under WCAG AA's 4.5:1 contrast minimum on `docs/samhita-lanes.html` — treat 4.5:1 body-text contrast as a floor for all new UI rather than repeating that failure.
