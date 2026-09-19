# Brief — SIH Idea Submission Deck (Vansh)

**Deliverable:** the idea PPT on the SIH portal.
**Source of truth:** `docs/SAMHITA-PLAN.md` and `CLAUDE.md` §9.
**Research status:** everything quoted below is verified. See `docs/briefs/himanshi-research.md`
Part A. Nothing on these slides is waiting on Himanshi.

## How to use this file

Copy the text in the boxes exactly. Slide headings and the layout of every slide stay as they are
now. Only the words inside change. Where a box is new, it goes in the space that currently holds a
placeholder.

Three hard rules that override taste:

1. The words **biopiracy, misappropriation, stolen, theft** appear nowhere. Slide 2 currently uses
   "misappropriation" and it has to go. This is a legal exposure question, not a style preference.
2. No target numbers. Every figure below is a published external fact with a source. We never print
   a number describing how well our own system performs, because we have not measured it yet.
3. The AYUSH patent guidelines are labelled **draft** wherever they appear.

---

## Sir's feedback, and where each item is handled

| Feedback | Where |
|---|---|
| Hindi text in a different colour from English | §Formatting |
| One graph, signify what it shows | Slide 2, §The one graph |
| Title precise, no commas | Slide 1 |
| Slide 6 IEEE format with name and direct link | Slide 6 |
| Space for demo link, GitHub link separately | Slide 6 |
| Why this matters, and TAM/SAM/SOM more impactful, quantify | Slide 2 and Slide 5 |
| Symbol for dossier and agents | §Formatting |
| Architecture image from Devansh on technical approach | Slide 3 |
| Watermark stays, background white | §Formatting |

---

# SLIDE 1 — Title page

Keep the layout. Replace the text block.

```
Problem Statement ID     26045

Problem Statement Title  IP-SAKTI Sahayak: A Multilingual Source-Cited AI Assistant
                         for Ayurvedic Intellectual Property and Regulatory Guidance

Theme                    MedTech / BioTech / HealthTech

PS Category              Software

Team ID                  TH69

Team Name                VedaNova
```

Two fixes in there. The current slide reads "Al Assistant" with a lowercase L instead of a capital i,
so it says "Al" not "AI". And the commas are gone, as asked. If the portal requires the PS title
copied character for character from the official listing, use the official string and apply the
no-commas version only to any place we write our own title.

---

# SLIDE 2 — Idea and proposed solution

Layout is locked. Problem and Why This Matters on the left, dossier and agents in the middle, USP on
the right, How Our Solution Addresses The Problem along the bottom.

## Product name block (top)

```
SAMHITĀ (संहिता)
The compendium. The word Ayurvedic law uses for its own authoritative texts.
```

## THE PROBLEM

Three bullets. These replace the current three.

```
•  An Ayurvedic MSME cannot tell which of the seven IP regimes are open to its
   formulation without legal counsel it cannot afford. Close to 9,000 licensed AYUSH
   manufacturing units operate in India. Only 44 hold WHO-GMP certification.

•  Patent applications covering Indian traditional knowledge are published in the
   Patent Office Journal every Friday. Almost nobody in India reads it, and the
   objection window closes quietly.

•  TKDL holds 418,885 codified formulations but is closed under agreement to 17 patent
   offices. Community-held knowledge was never inside it, and has no defensive route
   at all.
```

The second bullet is the one that sets up the whole deck. Do not shorten it.

## WHY THIS MATTERS

One block. Sir asked for impact and numbers, so this is built entirely from verified figures.

```
India has won these fights before, and paid for the timing.

The turmeric patent fell in about a year for roughly US$10,000, because CSIR already
had 32 prior-art references ready to file.

The neem patent took from 1995 to March 2005. Same country, same prior art, ten years
instead of one, because that fight happened after the patent was granted.

Rule 55(1A) guarantees that no Indian patent may be granted for six months after the
application publishes. Inside that window, Section 25(1) lets any person object using
Form 7A. Outside it, the only remedy left is litigation.

Roughly 370 applications have been stopped worldwide on TKDL evidence in two decades.
That is about 18 a year, and only patent offices can run the search.
```

## The one graph

Sir asked what the graph signifies. Use one graph in the deck and make it this, placed beside
Why This Matters. A horizontal statutory timeline, not a bar chart and not an architecture box.

```
Filing ──▶ Publication ──▶ [ OBJECTION WINDOW OPEN ] ──▶ Earliest ──▶ Grant
            Section 11A        Section 25(1)                possible
            18 months          any person, Form 7A          grant
                               Rule 55, six months          Rule 55(1A)

              ▲                          ▲
        Prahari alerts here      countdown runs here
```

Caption underneath, which is the "signify" answer:

```
The six-month gap between publication and the earliest possible grant is the only
period in which a bad patent can be stopped by filing a form. SAMHITĀ exists to make
sure that window is never missed.
```

## ONE DOSSIER, TWO AGENTS.

Heading stays. Replace the line under it.

```
One knowledge graph. One agent advises. One agent watches.
```

The current subtitle says "global vigilance", which overstates what we built. Our primary stream is
the Indian Patent Office Journal. Foreign filings are a later stage.

### FORMULATION DOSSIER (centre, with the document symbol)

```
FORMULATION DOSSIER
Dravya  |  Sourcing
Indication  |  Market

Persistent, and it is also the subscription.
Registering a formulation registers its species to the watchlist.
```

That last line matters. It explains why the user never has to supply a patent number.

### Sahayak (सहायक) box

```
Sahayak (सहायक)
IP PROTECTION AND ADVISORY

•  Protection map across all seven IP regimes, each open or barred with the section
   that decides it
•  Formulation classifier across six regulatory categories
•  Filing sequence with cost and clock, ordered by which door closes first
•  Examiner view, which argues the case against the applicant when a patent verdict
   looks open
```

The third bullet is new and it is the one judges react to. Getting the order right matters because
a trade secret is destroyed by your own disclosure, so that door closes by doing nothing.

### Prahari (प्रहरी) box

```
Prahari (प्रहरी)
PRE-GRANT OPPOSITION WATCHER

•  Reads the Patent Office Journal every Friday, filtered on IPC A61K36
•  Resolves botanical synonyms, since filings often use obsolete species names
•  Matches claims against published Formulary passages by entailment
•  Computes days remaining and drafts the Form 7A representation for human review
```

I changed the descriptor from "GLOBAL PATENT WATCHER". The settled decision in `CLAUDE.md` §9 is
that the domestic Journal is the primary stream and foreign filings are the stretch. Calling it
global on the slide is a claim we would have to walk back in questions. Flag this to sir if he wants
it back.

### SHARED KNOWLEDGE GRAPH strip

```
SHARED KNOWLEDGE GRAPH
Formulations • Dravya • Statutes • Prior art • Patents • Obligations

Every edge carries its source and its confidence. Nothing enters without a citation.
```

## INNOVATION AND USP

Four boxes. The current four could be written by any team in the room. These cannot.

```
Box 1
Watches at publication, not at grant
Before grant, stopping a patent costs a form. After grant it costs a lawsuit.

Box 2
Reaches knowledge TKDL was never built to cover
TKDL protects codified texts. Community-held formulations get a defensible,
timestamped public record instead.

Box 3
Verification is a separate step, not a prompt instruction
Every generated sentence is entailment-checked against the span it cites. The system
abstains rather than guess.

Box 4
Multilingual, with citations left alone
We translate the question and the answer. We never translate the statute, because a
translated statute is not the statute.
```

## HOW OUR SOLUTION ADDRESSES THE PROBLEM

This is empty in the current deck. It says "Refine with more details (optional)". Fill it with a
direct map back to the three problem bullets, in the same order.

```
MSME cannot afford counsel      →  Sahayak returns a seven-regime map with sections
                                   cited, then an ordered filing sequence with costs.

Nobody reads the Journal        →  Prahari reads it every Friday, unprompted, and
                                   pushes an alert with days remaining and a drafted
                                   Form 7A.

Community knowledge unprotected →  A timestamped public record with a permanent
                                   identifier, created only after the holder is shown
                                   what they give up by publishing.
```

The third line needs care in questions. Publishing kills future patents on that knowledge, and it
also gives the knowledge away permanently. We present the choice and record consent. We do not
publish on anyone's behalf. If asked, say that plainly.

---

# SLIDE 3 — Technical approach

Replace the current diagram with Devansh's architecture image. Full width, centred.

Add a strip under the image. Keep it to four lines so the image stays dominant.

```
Deterministic where it matters.

Retrieval is hybrid, keyword plus vector, over a version-tracked corpus, joined to a
knowledge graph of dravya, formulations and statutes.

The Verification Agent is a separate deterministic node. It checks each generated
sentence against the source span it cites, then either releases the answer or abstains
to a human reviewer.

Prahari runs from a Friday scheduler, never from a live query.
```

Nothing else on this slide. No model names, no vendor names. A domain judge does not gain anything
from reading an embedding model's name, and a technical judge will only ask why we did not pick a
different one.

---

# SLIDE 4 — Feasibility and viability

Keep all four quadrants, the three challenge columns and the closing line. Replace the bullets.

## Subtitle

```
Buildable now on free tiers, deployable through AIIA, and defensible in questions.
```

## Technical Feasibility

```
•  Agent orchestration with modular, independently testable nodes
•  Hybrid retrieval over roughly 11,500 chunks from 15 Indian statutes and 8
   international instruments
•  Patent Office Journal carries application number, filing date, IPC, applicant and
   abstract per record, which is all the parser needs
•  Deterministic verification and rule-based obligation checks, so legal outputs never
   depend on model mood
```

## Financial Feasibility

```
•  Zero-cost prototype on free tiers, open models and public datasets
•  Total data footprint around 110 MB, roughly a fifth of a single free database tier
•  Deployment through AIIA, CSIR and authorised bodies
•  Paid scaling is a roadmap slide, never a dependency
```

## Operational Feasibility

```
•  Sahayak answers on demand. Prahari runs weekly on a schedule
•  One weekly PDF per sweep, a bounded and predictable input
•  Human review is mandatory before any output leaves the system. No auto-filing
•  Adding a new market is a data file, not a code change
```

## Institutional and Social Viability

```
•  Innovators get protection routes they can act on, in order, with costs
•  Researchers get source-cited prior art without needing TKDL credentials
•  Institutions get a standing national watchlist that runs with zero users signed up
•  Knowledge holders get a route that does not require them to expose anything they
   have not chosen to expose
```

The third bullet is worth saying out loud in questions. The watchlist produces alerts whether or not
a single user registers, which is what makes this a ministry instrument rather than an app.

## Strategies for Overcoming Challenges

### DATA AND KNOWLEDGE

```
•  Sources scattered across portals, so we ingest once into a version-tracked corpus
   and cite the official URL
•  TKDL is closed under agreement, so we ship an adapter interface and use the
   published Formulary and Pharmacopoeia as the open source
•  Law changes, so a nightly diff re-embeds only what moved and flags answers that
   relied on the old text
```

### AI AND TECHNICAL

```
•  Hallucination, handled by entailment-checking every sentence against its cited span
   before release
•  Uncertainty, handled by abstaining and escalating rather than answering anyway
•  Limited compute, handled with CPU-runnable models, caching and free-tier fallbacks
```

### TRUST AND LEGAL

```
•  Findings are described as prior art potentially relevant to an application. No
   accusation is made against any party
•  No restricted content is used or claimed. Our prior-art corpus is published
   government material
•  Expert sign-off is required before anything is filed or sent
```

## Closing line

```
Data privacy and legal safety: dossiers stay under user control, only public sources
are used, and human review is required before any external action. A Section 25(1)
representation submits prior art for examination. It does not accuse anyone.
```

---

# SLIDE 5 — Impact and benefits

Keep every block. Replace the text. This is where sir asked for quantification, so the market
section is rebuilt.

## Subtitle

```
From scattered statutes to a dated, cited, actionable protection plan.
```

## BENEFITS OF THE SOLUTION

```
For AYUSH Innovators and Startups
•  Seven regimes answered with the section that decides each
•  A filing order with costs, so money goes to the right door first

For Researchers and Knowledge Holders
•  Source-cited prior art without TKDL credentials
•  Weekly alerts on filings that touch their species

For Government and Policymakers
•  A standing national watchlist across roughly 50 priority dravya
•  Drafted Form 7A representations ready for review

For the Ayurveda and Innovation Ecosystem
•  Protection decided before disclosure destroys the option
•  Guidance in Hindi and English without translating the law itself
```

## Potential impacts on the target audience

```
•  Economy: cuts the cost of finding out whether a formulation is protectable at all
•  Innovation: moves the IP decision before disclosure, when it can still be changed
•  Knowledge: creates a citable record for formulations that currently have none
•  Society: puts guidance in reach of MSMEs that cannot fund a retainer
•  Governance: gives AIIA a weekly view of filings touching Indian traditional knowledge
•  Research: connects statutes, formularies and filings into one queryable graph
```

## Business Model

Sir asked for TAM, SAM and SOM with real numbers. Every figure here is published and sourced.

```
TAM
Close to 9,000 licensed AYUSH manufacturing units in India, inside an AYUSH market
valued at US$43.4 bn in 2024, of which manufacturing is about US$24 bn. Our market is
the IP and regulatory advisory spend across those units, not the sector itself.

SAM
The MSME segment that needs protection guidance and cannot fund a legal retainer.
Only 44 units hold WHO-GMP certification, about 0.5% of the total, so the export-ready
tier is small and the unprotected tier is nearly all of it.

SOM
Institutional deployment first, measured in dossiers watched and windows caught rather
than revenue. AIIA, CSIR, NMPB, State Biodiversity Boards and the AYUSH startup cohort.
The national watchlist produces alerts with zero users signed up.
```

Say this in questions if it comes up: the buyer is the ministry, not the MSME. Pricing this per seat
would be the wrong shape for a public-goods instrument.

## FUNDING SOURCES FOR SUSTAINABILITY

```
Government and Institutional Grants
Ministry of AYUSH • AIIA / CSIR • Startup India

Academic and Research Partnerships
Universities • Research institutions • Knowledge programmes

Innovation and Global Support
National digital initiatives • International grants
```

## SUPPORTING SOURCES

```
Institutional Partnerships
AIIA, CSIR and AYUSH institutions

CSR and Innovation Funding
Technology companies and foundations

Authorised Integrations
Registry and patent databases, and TKDL through the adapter if access is granted
```

Note the change in the third box. The current deck lists TKDL as an integration, which reads as
though we have it. We do not, and nobody does without an agreement. The wording above is accurate
and it also shows we understand the constraint.

## TARGET CUSTOMERS

```
•  AYUSH innovators, startups and MSMEs
•  Researchers and knowledge holders
•  Cultivators and traditional communities
•  AIIA, CSIR and government institutions
```

## FINANCIAL MODEL

```
•  Public instrument stays free, including the national watchlist
•  A curated pre-grant alert feed for IP firms funds the public side
•  Sponsored datasets through research partnerships
•  Authorised registry connectors added only with logged consent
```

The second line is the honest answer to how this survives without a budget. A deduplicated feed of
A61K36 filings with computed deadlines has real value to practitioners.

## VALUE ADDED SERVICES

```
•  Protection map and formulation classifier
•  Filing sequence with cost and timing
•  Benefit-sharing liability estimate under the 2025 ABS Regulations
•  Prahari alerts with drafted representations
```

The third item needs one caveat in questions. The slabs are confirmed across several independent
legal summaries but the gazette check is still open, so we describe it as an estimate until that
lands.

## SCALABILITY

```
•  Start with the domestic Journal and a focused corpus
•  Extend the graph as formularies are parsed
•  Add foreign filing streams and voice
•  Scale nationally through AIIA without changing the architecture
```

## Closing line

```
Protect what can be protected. Watch what cannot. Cite everything.
```

---

# SLIDE 6 — Research and references

Sir asked for IEEE format with names and direct links, a space for the demo link, and GitHub kept
separate.

## Top strip, unchanged in layout

```
Sample UI development by the team
SAMHITĀ: Ask Sahayak, Prahari watchtower and Evals dashboard
```

## New link block, placed to the right of the UI screenshots

```
LIVE DEMO      [ paste deployed URL here ]
SOURCE CODE    [ paste GitHub repository URL here ]
```

Keep these two visually separate from the reference list. They are ours, the rest are not.

## Reference App and Web

Keep the seven chips. Add the URL under each name so they are clickable.

```
India Code          indiacode.nic.in
WIPO Lex            wipolex.wipo.int
IP India            ipindia.gov.in
Google Patents      patents.google.com
AYUSH / AIIA        ayush.gov.in
POWO, Kew           powo.science.kew.org
GBIF                gbif.org
```

I replaced the TKDL chip with IP India. Listing TKDL as a source we use is not accurate, and the
Patent Office Journal we actually depend on lives on the IP India portal, which is currently missing
from the deck.

## Reference Article and Sources, IEEE style

Replace all eight bullets. The current list cites Neo4j and Qdrant, and neither is in our stack.
Neo4j was deliberately dropped.

```
[1]  The Patents Act, 1970, ss. 3(d), 3(e), 3(p), 11A, 25(1), 145. India Code.
     https://www.indiacode.nic.in

[2]  The Patents Rules, 2003, r. 55 and r. 55(1A), Form 7A, pre-grant representation.
     Office of the Controller General of Patents, Designs and Trade Marks.
     https://ipindia.gov.in

[3]  Official Journal of the Patent Office, published weekly under s. 145.
     Office of the Controller General of Patents, Designs and Trade Marks.
     https://search.ipindia.gov.in/IPOJournal/Journal/Patent

[4]  The Biological Diversity Act, 2002, as amended 2023, and the Biological Diversity
     (Access and Benefit Sharing) Regulations, 2025. National Biodiversity Authority.
     https://nbaindia.org

[5]  The Geographical Indications of Goods (Registration and Protection) Act, 1999.
     India Code. https://www.indiacode.nic.in

[6]  The Trade Marks Act, 1999, s. 9, absolute grounds for refusal. India Code.
     https://www.indiacode.nic.in

[7]  Ayurvedic Formulary of India, Part I, and Ayurvedic Pharmacopoeia of India.
     Ministry of AYUSH, Government of India. https://ayush.gov.in

[8]  Draft Guidelines for Processing of Patent Applications relating to AYUSH and
     Traditional Knowledge, 5 February 2025. Office of the Controller General of
     Patents, Designs and Trade Marks. Draft status, not settled law.
     https://ipindia.gov.in

[9]  Traditional Knowledge Digital Library, CSIR and Ministry of AYUSH. Access by
     agreement with patent offices. https://www.tkdl.res.in

[10] WIPO Treaty on Intellectual Property, Genetic Resources and Associated
     Traditional Knowledge, 2024. WIPO Lex. https://wipolex.wipo.int
```

Reference [8] carries the draft note inside the citation, which is the safest place for it.

## Closing line

```
Every claim in this deck traces to a statute, a rule, a published government text or a
named registry. Where a source is draft or unverified, the deck says so.
```

---

# Formatting notes

## Hindi and Devanagari colour
Devanagari renders in a different colour from the English beside it, everywhere it appears:
SAMHITĀ (संहिता), Sahayak (सहायक), Prahari (प्रहरी). Pick one accent and use it for all three.
Keep contrast at 4.5:1 or better against white.

## Symbols
- Formulation Dossier: a document or folder glyph, used everywhere the dossier is named
- Sahayak: the leaf, as in Devansh's architecture image
- Prahari: the binoculars, as in Devansh's architecture image

Using the same glyphs as the architecture image means slide 2 and slide 3 read as one system.

## Background
White background. The watermark stays, kept very light so nothing sits on top of it at low contrast.
No watermark behind the reference list or any dense block of text on slide 6.

## Type
Body text at a size that survives a projector. If a box needs a smaller size to fit, cut words
instead.

---

# Pre-upload checklist

- [ ] Search the whole deck for biopiracy, misappropriation, stolen, theft. Zero hits.
      Slide 2 currently fails this.
- [ ] Neo4j and Qdrant removed from slide 6
- [ ] "Al Assistant" corrected to "AI Assistant" on slide 1
- [ ] AYUSH guidelines labelled draft in reference [8]
- [ ] Demo link and GitHub link both filled, and visually separate from the references
- [ ] Devansh's architecture image on slide 3, full width
- [ ] Every Devanagari string in the accent colour
- [ ] No number anywhere describing our own system's accuracy
- [ ] Read-back test: someone who has not seen the plan reads the deck and says the USP back.
      If they do not mention a window or a deadline, slide 2 needs another pass.
