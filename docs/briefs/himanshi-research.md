# Brief — Research & Source Verification (Himanshi)

**Owner:** Himanshi · **Status:** critical path · **Blocks:** the SIH idea PPT, and every
citation in the product after it.

---

## Why this lane exists

SAMHITĀ's entire premise is *"it never fabricates authority."* That premise is only as true as
this lane. One human converts raw law into verified facts; if that doesn't happen, we ship a
confident legal advisor with no ground under it — which, for a Ministry of AYUSH tool, is worse
than shipping nothing.

**Standing rule (from the plan's appendix):** every statutory reference in our documents is a
*pointer for verification*, not an authority. Nothing reaches a slide or the UI until it has been
checked here.

---

## How to record a verification

One row per item, in a file or sheet, with these fields. The product's regulatory-profile engine
uses the same shape (`verified_by`, `verified_on`, `citation`), so this is not throwaway work.

| Field | Meaning |
|---|---|
| `claim` | The exact sentence we want to put on a slide or in the UI |
| `instrument` | Act / Rules / Regulations / Treaty, with year |
| `provision` | Section, Rule, Article, Form number |
| `source_url` | **Primary** source — India Code, WIPO Lex, or the gazette. Not a law-firm blog |
| `verbatim` | The operative words, quoted |
| `status` | `verified` · `differs` · `not found` · `superseded` |
| `notes` | Anything that changes how we should phrase the claim |

`differs` and `superseded` are **valuable results, not failures.** A claim we retract before
submission costs nothing; one a judge catches costs the round.

---

## Priority 1 — blocks the PPT (do these first)

### 1.1 The opposition window (our entire USP rests on this)
Verify against India Code, Patents Act 1970 and Patents Rules:

- [ ] **Section 11A** — publication of applications. Confirm the 18-month period and the Form 9
      early-publication route.
- [ ] **Section 11A(?) / Rules** — confirm the rule that **no patent shall be granted before six
      months from the date of publication.** Find the exact provision number. *This single fact is
      the countdown in our product; we must cite it precisely.*
- [ ] **Section 25(1)** — pre-grant opposition. Confirm it is available to **"any person"** (not
      "person interested") and quote the phrase.
- [ ] **Rule 55** — procedure for 25(1) representation. Confirm **Form 7A** is the correct form and
      that it is still current.
- [ ] **Section 25(2)** — post-grant opposition, for contrast. Confirm the 12-month period and the
      **"person interested"** limitation.
- [ ] **Section 145** — confirm this is the provision requiring publication of the Official Journal.

### 1.2 The patenting bars
- [ ] **Section 3(p)** — traditional knowledge exclusion. Quote verbatim.
- [ ] **Section 3(e)** — mere admixture. Quote verbatim. *This is the one that actually kills
      polyherbal patents, and our Examiner View leans on it.*
- [ ] **Section 3(d)** — quote verbatim.

### 1.3 ABS — benefit-sharing slabs (highest risk item on the list)
We intend to show a **rupee figure**. A wrong one in front of an AYUSH officer is unrecoverable.

- [ ] Locate the **Biological Diversity (Access and Benefit Sharing) Regulations, 2025** — reported
      as notified **29 April 2025**, replacing the 2014 ABS Guidelines. Confirm the date and that it
      is in force.
- [ ] Verify the benefit-sharing slabs **against the gazette notification**, not against law-firm
      summaries. Currently sourced only from secondary commentary, which agreed with itself but is
      not authority. Reported as:
      - turnover up to ₹5 crore → **exempt**
      - ₹5–50 crore → **0.2%** of annual gross ex-factory sale price
      - ₹50–250 crore → **0.4%**
      - above ₹250 crore → **0.6%**
      - high-value resources (red sanders, sandalwood, agarwood, threatened species) → **≥5% upfront**
        on auction / sale / purchase price
- [ ] Confirm the **exemption threshold**. *Most AYUSH MSMEs fall under it, so "you owe nothing" is
      our most common honest answer and it must be right.*
- [ ] Confirm **Digital Sequence Information (DSI)** is expressly within scope.
- [ ] Confirm the **Biological Diversity (Amendment) Act, 2023** position for Indian entities —
      intimation to the State Biodiversity Board vs. prior NBA approval. Quote the provision.
- [ ] Note any provision distinguishing **codified vs. non-codified** traditional knowledge.

### 1.4 AYUSH patent guidelines — status check
- [ ] **Draft Guidelines for AYUSH patent applications (IP Office, 5 Feb 2025)** — are they still
      **draft**, or have they been finalised? Get the current status and the date of any final version.
- [ ] Quote verbatim the two phrases we rely on: the requirement that a combination show an effect
      **"greater than the sum of its individual components,"** and the treatment of ratio-optimisation
      / single-component isolation as **"routine practice."**
- [ ] **Until finalisation is confirmed, every appearance in the deck and UI must be labelled "draft."**

### 1.5 Trade marks — the absolute-grounds screen
- [ ] **Trade Marks Act 1999, Section 9** — absolute grounds for refusal. Quote the descriptiveness
      limb. *We want to tell a user that "Ashwagandha Churna" is descriptive and unregistrable as a
      word mark — confirm that is a correct reading.*
- [ ] Confirm current MSME / startup filing-fee position for a word mark (fee rebate, if any, and
      the amount). **If the rebate cannot be confirmed, we show no figure.**

### 1.6 Market-size figures (or we delete them)
The deck currently carries two unverified numbers. Either source them or they come out.

- [ ] Count of **licensed AYUSH manufacturing units in India** — Ministry of AYUSH or NMPB
      publication preferred. Give the figure, the year, and the source.
- [ ] Any published figure for **IP / regulatory advisory spend** by AYUSH MSMEs. If none exists,
      say so — we will present the market differently rather than invent a number.

---

## Priority 2 — needed for the build, not the PPT

- [ ] **TKDL scope** — confirm in writing that TKDL covers **codified** texts. We claim
      community-held / non-codified knowledge is outside it; that claim needs a citable basis.
- [ ] **Ayurvedic Pharmacopoeia of India** — locate a working source. `cdn.ayush.gov.in` did not
      resolve on 2026-09-10. AFI Part I alone is sufficient if API is unavailable; we just need to
      know which.
- [ ] **Six landmark cases** for the Examiner View — turmeric, neem, Basmati, plus three Indian
      3(p)/3(e) decisions. Citation, holding in two sentences, and the source.
- [ ] **US and EU herbal market-access profiles** — the ~14 decision-relevant fields each, per the
      regulatory-profile schema (plan §7). EU traditional-herbal registration route: confirm
      Directive 2004/24/EC Art. 16c and the evidence-years requirement.
- [ ] **GI Registry** — ~20 Ayurveda-relevant registered GIs, with registration numbers.

---

## What "done" looks like for Priority 1

Every box above ticked with a primary-source URL and a verbatim quote, or explicitly marked
`not found` / `differs` / `superseded`. Items that come back anything other than `verified` get
removed from the deck or rephrased — **not** softened and kept.

Deliver the Priority 1 table before the deck is written, not alongside it. Vansh's script
(`docs/briefs/vansh-deck.md`) cannot be finalised without it.
