# Brief — SIH Idea Submission Deck (Vansh)

**Owner:** Vansh · **Deliverable:** the idea/abstract PPT uploaded to the SIH portal.
**Depends on:** `docs/briefs/himanshi-research.md` Priority 1. Do not finalise any slide carrying a
statutory citation or a market figure until that comes back.

---

## 0. Before you open PowerPoint

- [ ] Download the **current year's official SIH idea template** from the portal. It is fixed —
      slides cannot be added. Confirm slide count, section titles, and whether team/institute
      identifying information is forbidden.
- [ ] Everything below is written to fit that template. If this year's differs, tell the team before
      restructuring.

---

## 1. The one thing this deck must achieve

A judge should finish slide 1 and be able to say: **"they're the ones who catch bad patents during
the objection window."**

If they instead say *"an AI assistant for Ayurveda IP,"* the deck has failed, no matter how good the
rest is. Every other team is an AI assistant for Ayurveda IP.

### The USP, verbatim — use this language

> **SAMHITĀ is a deadline engine, not a chatbot.** Every Friday it reads the Patent Office Journal,
> finds applications over Indian traditional knowledge at the moment they publish under Section 11A,
> and hands the ministry a drafted Form 7A pre-grant opposition — with a countdown. Before grant,
> stopping a bad patent costs a form. After grant it costs a lawsuit.

**Lead with the window. Never lead with the architecture.**

---

## 2. Slide-by-slide

### Slide — Idea / Proposed Solution

Two elements only.

**1. The timeline visual.** A horizontal statutory timeline, not an architecture box-diagram:

```
Filing ──▶ Publication ──▶ [ OPPOSITION WINDOW OPEN ] ──▶ Earliest ──▶ Grant
            s.11A              s.25(1), any person         possible
            18 months          Form 7A, Rule 55            grant
                                                           +6 months
              ▲                        ▲
        our alert fires          countdown shown
```

**This is the image the judges remember.** Give it the most space on the slide.

**2. One worked example, end to end.** A single named formulation, run through to an *ordered*
recommendation — not a list of verdicts:

- *Today, ₹0* — lock process ratios as trade secret. Destroyed by your own disclosure, so this
  door closes by inaction.
- *This week* — file the word mark, Class 5. Long pendency, so the clock starts now.
- *Before publishing anything* — publishing synergy data destroys your own novelty.
- *Barred* — patent, Section 3(p), with the reason stated.

The **ordering** is the insight. "What's open" is a list; "what to do Monday, in order" is a product.

### Slide — Technical Approach

One flow line, categories not vendors:

`Version-tracked corpus → hybrid retrieval (keyword + vector) → grounded generation →
deterministic Verification Agent → answer with citations, or abstain to a human`

Plus one line each:

- **Knowledge graph** over dravya / formulation / statute entities. The PS asks for one by name —
  say it, don't illustrate it.
- **Friday sweep** of the Patent Office Journal, filtered on IPC `A61K36/*`.
- **Verification is a separate deterministic step, not a prompt instruction** — each generated
  sentence is entailment-checked against the span it cites. This is why "never fabricates authority"
  is an architectural guarantee rather than a promise. Worth the sentence.
- **Multilingual** — one line, and make it the interesting one: *we translate the question and the
  answer, never the citation. A translated statute is not the statute.*

### Slide — Feasibility & Viability

- Open, authoritative sources only; zero licence cost; staged build with a working cited-retrieval
  MVP first.
- **Pre-empt the TKDL objection here — do not wait to be asked.** TKDL has no public API and is
  NDA-gated. We ship a documented adapter interface CSIR can wire up, and our live prior-art source
  is the Ayurvedic Formulary and Pharmacopoeia — already-published government books, so we disclose
  nothing new. Saying this before a judge raises it is worth more than answering it after.
- Sustainability: **free public ministry instrument; a professional pre-grant-alert feed for IP
  firms funds it.** One line.

### Slide — Impact & Benefits

This is where commercialisation lives. Most teams leave this slide vague — don't.

- **ABS liability as a rupee figure**, computed from the 2025 Regulations' slabs — *including the
  exemption*, because most AYUSH MSMEs fall under it and "you owe nothing, here's why" is a real and
  trustworthy answer. **Only if Himanshi returns `verified`.**
- **Protection for non-codified traditional knowledge** — the community-held vaidya and tribal
  knowledge TKDL was never designed to cover. Presented as an informed choice between defensive
  publication, trade secret plus a benefit-sharing contract, and the statutory route. **Never as a
  "publish" button** — publication forfeits secrecy permanently, and a judge who knows the field
  will test whether we understand that.
- TAM / SAM / SOM — see §3.

### Slide — Research & References

India Code · WIPO Lex · Patent Office Journal (s.145) · Ayurvedic Formulary & Pharmacopoeia ·
Biological Diversity (ABS) Regulations 2025 · AYUSH patent guidelines **(labelled draft)**.

Every citation verified against a primary source first.

---

## 3. TAM / SAM / SOM — the framing that separates us

**Do not open with "the AYUSH sector is worth $24 billion."** Every competing deck will. It is a
sector size, not an addressable market, and quoting it signals we don't know the difference.

Our market is **spend on IP and regulatory advisory** — a fraction of a fraction.

| | Definition |
|---|---|
| **TAM** | Annual IP + regulatory advisory spend across licensed AYUSH manufacturing units in India |
| **SAM** | The MSME subset that cannot afford an attorney retainer *and* has export or protection intent |
| **SOM** | Year-one reach measured in **institutional seats and dossiers watched**, not revenue — AIIA, NMPB, State Biodiversity Boards, the AYUSH startup cohort |

Two things to say out loud:

- **The buyer is the ministry, not the MSME.** This is a public-goods instrument. The national
  watchlist runs and produces alerts **with zero users signed up** — that is the product.
- **Numbers carry their sourcing status.** If Himanshi cannot source the unit count and the per-unit
  spend, we present the market qualitatively rather than inventing figures. *"We haven't verified
  that yet"* survives Q&A; a fabricated number does not — and putting one on a slide would
  contradict the product's own premise on its own slide.

---

## 4. Cut list — do not put these in the deck

| Cut | Why |
|---|---|
| The three-tier depth controller (Quick/Guided/Deep) | An internal cost optimisation. Invites "how is that novel?" and the honest answer is that it isn't. |
| A seven-row table of IP regimes | Seven abstract rows read as a list. The one worked example replaces it. |
| A node-link knowledge-graph picture | Every team's graph visual looks identical. Name the graph; don't illustrate it. |
| Model names (embedding model, reranker, NLI model) | Noise to a domain judge; invites "why not model X?" from a technical one. |
| Vendor names (Supabase, Langfuse, NeMo, HF Spaces) | Dates the deck and invites lock-in questions. Use categories. |
| Team capacity, hours, week-by-week schedule | Internal. Feasibility is "staged build, MVP first," not a Gantt chart. |
| Multilingual as a headline differentiator | Table stakes straight from the PS. One line, and make it the citation rule. |
| Any target or goal number | Measured values only, or nothing. Non-negotiable. |
| The words "biopiracy", "misappropriation", "stolen", "theft" | Legal-liability framing, not a tone preference. Zero occurrences permitted. |

---

## 5. Q&A — rehearse these out loud

If an answer takes more than two sentences, it isn't ready.

| Question | Answer |
|---|---|
| *"Isn't this ChatGPT with documents?"* | It acts unprompted on a schedule, holds state and diffs against it, and outputs a filing-ready artifact with a statutory deadline. A chatbot does none of the four. |
| *"TKDL is closed. How do you do prior art?"* | A documented adapter interface CSIR can wire up. Our live source is the Formulary and Pharmacopoeia — published government books — so we disclose nothing new. And we reach the non-codified knowledge TKDL never covered. |
| *"Is this legal advice?"* | Information, not advice. Standing disclaimer, mandatory human review before anything leaves the system, and low confidence routes to a human IP facilitator. |
| *"What's your accuracy?"* | Measured on the PS's own four axes, with error analysis — including what we have not yet measured, labelled as such. |
| *"Why not name the foreign company?"* | A Section 25(1) representation doesn't accuse anyone; it submits prior art relevant to examination. Naming a party is liability for no legal benefit. |
| *"How is this sustainable at zero cost?"* | Free public ministry instrument; a professional alert feed for IP firms funds it. |
| *"Who else does this?"* | Nobody watches at publication with a computed window. Watching at grant is too late by design. |
| *"What if the Journal format changes?"* | The parser is one adapter behind an interface — the same pattern as the TKDL adapter. |

---

## 6. Sign-off checklist

- [ ] Himanshi's Priority 1 table returned; every citation on a slide marked `verified`
- [ ] AYUSH guidelines labelled **draft** wherever they appear
- [ ] Market figures sourced, or the slide rewritten without them
- [ ] Zero occurrences of "biopiracy", "misappropriation", "stolen", "theft"
- [ ] Zero target/goal numbers anywhere
- [ ] A real Patent Office Journal record with a visible `A61K36` IPC field, screenshotted onto the
      Idea slide — makes the USP concrete rather than claimed
- [ ] **Read-back test:** someone who has not seen the plan reads the deck and states the USP back.
      If they don't mention a deadline or a window, slide 1 needs rewriting.
