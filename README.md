# SAMHITĀ (संहिता) — IP-Sakti Sahayak

Built for **SIH 2026, Problem Statement 26045** (Ministry of AYUSH / All India
Institute of Ayurveda). SAMHITĀ maps an Ayurvedic formulation's protection
status across all seven Indian IP regimes (patent, trademark, GI, copyright,
design, trade secret, plant variety) and watches the weekly Patent Office
Journal for foreign filings that may anticipate Indian traditional knowledge.

Two agents sit on top of one shared knowledge graph:

- **Sahayak** — builds a formulation's "IP Protection Map" and answers
  questions about it (`/ask`, `/dossiers`).
- **Prahari** — an unprompted watcher that drafts pre-grant opposition
  dossiers from journal sweeps (`/prahari`).

Full architecture and the phase-by-phase build plan live in
[`docs/SAMHITA-PLAN.md`](docs/SAMHITA-PLAN.md) and
[`docs/Ip_sakti_architecture.jpeg`](docs/Ip_sakti_architecture.jpeg) —
this README only covers running what's here today.

## Current status

**This repo currently contains the frontend only, with a mocked backend.**
There is no `services/brain` (FastAPI + LangGraph agent runtime) and no
Supabase project yet — every "API call" the UI makes is served by an
in-memory mock layer (`src/lib/mock/*`) behind `src/lib/api.ts`. That file's
function signatures are the contract the real backend will need to satisfy;
swapping mock for real should mean editing that one file, not the pages that
call it.

Practically, this means: **one `npm run dev` is the entire app.** There is no
separate backend process to start (see [Running it](#running-it) below).

## Tech stack (this repo, today)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Icons | lucide-react |
| Data | Mocked in-memory (`src/lib/mock/*`) — no database yet |

The *planned* full stack (FastAPI/LangGraph agent runtime, Supabase,
Bhashini, Langfuse, NeMo Guardrails, etc.) is documented in
[`CLAUDE.md`](CLAUDE.md) §3 and `docs/SAMHITA-PLAN.md` §5 — none of it is
wired up yet.

## Prerequisites

- Node.js 20+ and npm (this repo was built against Node 24; anything 20+
  should work for Next.js 16)

## Running it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. That's it — one terminal, one command.
(A second terminal for a backend will only be needed once `services/brain`
actually exists — see [Current status](#current-status).)

Other scripts:

```bash
npm run build   # production build
npm run start   # run a production build locally
npm run lint    # eslint
```

## Project structure

```
src/
  app/                  # Next.js App Router — one folder per route
    page.tsx            #   / (Formulation Overview / home page)
    ask/                #   /ask — Sahayak + Prahari dual-agent chat
    dossiers/           #   /dossiers, /dossiers/[id]
    prahari/            #   /prahari, /prahari/[id]
    graph/              #   /graph — knowledge graph visualization
    evals/              #   /evals — live eval-metrics dashboard
    settings/           #   /settings — consent ledger & audit log
    globals.css         #   design tokens (colors, fonts, .glass utility)
  components/
    ui/                 # shadcn/ui primitives (button, table, dialog, ...)
    ask/                # components specific to the /ask chat experience
    app-shell.tsx        # sidebar + mobile nav + footer, wraps every page
    *.tsx                # shared one-off components (ring charts, badges, ...)
  lib/
    api.ts               # the mock service layer — THE file to swap for a real backend
    mock/                 # fixture data api.ts reads from (dossiers, prahari alerts, evals, ...)
    types.ts              # shared TypeScript types for the domain model
    labels.ts             # enum -> human-readable label maps
public/
  images/                 # static imagery (herb/ingredient photos, backgrounds)
docs/
  SAMHITA-PLAN.md         # authoritative build plan (phases, ownership, schedules)
  Ip_sakti_architecture.jpeg
CLAUDE.md                 # working agreement / conventions for AI-assisted dev on this repo
```

## Team: cloning and running this locally

```bash
git clone https://github.com/Diavats/IP-SAKTI.git
cd IP-SAKTI
npm install
npm run dev
```

Open **http://localhost:3000**. No `.env` file, no database, no second
terminal needed — the whole app (including the "backend") runs from that one
command, since the backend is currently mocked inside the frontend itself.
