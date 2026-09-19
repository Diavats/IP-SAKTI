# Brief — Research & Source Verification (Himanshi)

**Owner:** Himanshi · **Status:** Priority 1 cleared, Priority 2 open
**Blocks:** nothing on the deck any more. Priority 2 blocks the build.

---

## Why this lane exists

SAMHITĀ's premise is that it never fabricates authority. That premise is only as true as this lane.
One human converts raw law into verified facts, and if that does not happen we ship a confident
legal advisor with no ground under it.

**Standing rule:** every statutory reference in our documents is a pointer for verification, not an
authority. Nothing reaches a slide or the UI until it has been checked.

---

## Part A — Cleared on 19 Sep 2026 (do not redo)

These were blocking the deck. They were checked so Vansh could start. Sources are **secondary**
(law-firm commentary, government press releases, industry bodies) unless marked otherwise. Anything
below that will appear as a **rupee figure or a quoted statute** still needs a primary-source pass,
flagged in Part B.

### Opposition window (the USP rests on this)

| Fact | Finding | Confidence |
|---|---|---|
| Publication of applications | **Section 11A**, 18 months from priority; early publication on request (Form 9) | Confirmed, multiple sources |
| Six-month bar on grant | **Rule 55(1A)**, Patents Rules. No patent shall be granted before expiry of six months from the date of publication under Section 11A | Confirmed. *This is the provision the countdown cites. Use Rule 55(1A), not Section 11A, for the deadline claim* |
| Pre-grant opposition | **Section 25(1)**, available to **"any person"**, filed in **Form 7(A)** under **Rule 55** | Confirmed |
| Post-grant opposition | **Section 25(2)**, 12 months, limited to a **"person interested"** | Confirmed |
| Journal publication duty | **Section 145** | Confirmed |

### Patent Office Journal structure
Weekly, every Friday. Per-record fields: application number, date of filing, title, publication
date, **International Patent Classification**, applicant name and address, inventor, priority
details. Sectioned into `EARLY PUBLICATION` and `PUBLICATION AFTER 18 MONTHS`, by office
(Delhi, Mumbai, Kolkata, Chennai). Paper and CD-ROM discontinued from 01/01/2009.

**The IPC field exists and is per-record.** Prahari's filter on `A61K36/*` is viable.

### Prior-art precedent, with costs and durations
- **Turmeric** (US re-examination): CSIR filed 32 prior-art references in Sanskrit, Urdu and Hindi.
  Patent withdrawn after roughly a year. Legal cost reported at about **US$10,000**.
- **Neem** (EPO opposition): revoked by the Opposition Division in **May 2000**, final appellate
  decision **8 March 2005**. Opposition originally filed in 1995.

Use the contrast: turmeric succeeded quickly because documentary prior art was ready; neem ran
roughly a decade because the fight happened after grant.

### TKDL scale and reach
- **418,885 formulations** transcribed as of 25 March 2022, of which **119,269 are Ayurveda**
  (others: Unani 236,399, Siddha 54,689, Yoga 4,151, Sowa Rigpa 4,377).
- Roughly **370 patent applications** globally rejected, withdrawn, amended, set aside or abandoned
  on TKDL evidence.
- Access is by agreement with **17 patent offices**. An Indian MSME cannot search it.
- A CSIR study reported EPO filings on Indian traditional medicine down **44% by 2011**.

### AYUSH sector scale
- Close to **9,000 AYUSH manufacturing units** in India.
- **44** Ayurvedic drug manufacturing units hold **WHO-GMP (CoPP)** certification from DCGI as of
  December 2024. That is about **0.5%** of units.
- AYUSH market **US$43.4 bn** (2024); manufacturing component about **US$24 bn**; services about
  US$26 bn.

### ABS benefit sharing
**Biological Diversity (Access and Benefit Sharing) Regulations, 2025**, reported as notified
**29 April 2025**, replacing the 2014 ABS Guidelines. Slabs on annual gross ex-factory sale price,
keyed to annual turnover:

| Annual turnover | Share |
|---|---|
| Up to ₹5 crore | Exempt |
| ₹5–50 crore | 0.2% |
| ₹50–250 crore | 0.4% |
| Above ₹250 crore | 0.6% |
| High-value resources (red sanders, sandalwood, agarwood, threatened species) | ≥5% upfront on auction, sale or purchase price |

Digital Sequence Information is expressly in scope.

> **Not cleared for a rupee figure.** Several independent law firms agree on these slabs, which is
> reassuring but is not authority. See Part B item 1 before any number appears in the product UI.

---

## Part B — Still open

### 1. ABS slabs, gazette verification (highest risk item in the project)
- [ ] Pull the **gazette notification** of the Biological Diversity (ABS) Regulations 2025 and
      confirm the date, the slab boundaries, the percentages and the exemption threshold.
- [ ] Confirm the exemption threshold specifically. Most AYUSH MSMEs fall under it, so
      "you owe nothing, here is why" is our most common honest answer and it has to be right.
- [ ] Confirm the **Biological Diversity (Amendment) Act 2023** position for Indian entities:
      intimation to the State Biodiversity Board against prior NBA approval. Quote the provision.
- [ ] Note any provision distinguishing codified from non-codified traditional knowledge.

### 2. Verbatim statutory text (needed for the product, not the deck)
Pull the operative words from India Code so the UI can quote rather than paraphrase.
- [ ] **Section 3(p)** traditional knowledge exclusion
- [ ] **Section 3(e)** mere admixture. *This is the one that actually kills polyherbal patents*
- [ ] **Section 3(d)**
- [ ] **Section 11A** and **Rule 55(1A)**, verbatim
- [ ] **Section 25(1)**, confirming the phrase "any person"

### 3. AYUSH patent guidelines, status
- [ ] Are the **Draft Guidelines for AYUSH patent applications (5 Feb 2025)** still draft, or
      finalised? Get the current status and any final-version date.
- [ ] Quote verbatim the two phrases we rely on: an effect **"greater than the sum of its individual
      components"**, and ratio-optimisation or single-component isolation as **"routine practice"**.
- [ ] Until finalisation is confirmed, every appearance in deck and UI stays labelled **draft**.

### 4. Trade marks
- [ ] **Trade Marks Act 1999, Section 9**, absolute grounds. Quote the descriptiveness limb.
      We want to tell a user that a name like "Ashwagandha Churna" is descriptive and unregistrable
      as a word mark. Confirm that reading is correct.
- [ ] Current MSME / startup filing-fee position for a word mark, and the amount.
      **If the rebate cannot be confirmed, no figure is shown.**

### 5. TKDL scope, citable basis
- [ ] Confirm in writing, from a citable source, that TKDL covers **codified** texts. We claim
      community-held and non-codified knowledge sits outside it, and that claim carries weight in
      the deck, so it needs a reference rather than an assertion.

### 6. Remaining build inputs
- [ ] **Ayurvedic Pharmacopoeia of India**, working source. `cdn.ayush.gov.in` did not resolve on
      2026-09-10. AFI Part I alone is sufficient for the graph seed if API is unavailable, we just
      need to know which.
- [ ] **Six landmark cases** for the Examiner View: turmeric, neem, Basmati plus three Indian
      3(p)/3(e) decisions. Citation, holding in two sentences, source.
- [ ] **US and EU herbal market-access profiles**, the roughly 14 decision-relevant fields each per
      the regulatory-profile schema (plan §7). For the EU traditional-herbal registration route,
      confirm Directive 2004/24/EC Art. 16c and the evidence-years requirement.
- [ ] **GI Registry**: roughly 20 Ayurveda-relevant registered GIs, with registration numbers.

---

## How to record a verification

One row per item. The regulatory-profile engine uses the same shape (`citation`, `verified_by`,
`verified_on`), so this is not throwaway work.

| Field | Meaning |
|---|---|
| `claim` | The exact sentence we want to put in the UI |
| `instrument` | Act / Rules / Regulations / Treaty, with year |
| `provision` | Section, Rule, Article, Form number |
| `source_url` | **Primary** source: India Code, WIPO Lex, or the gazette. Not a law-firm blog |
| `verbatim` | The operative words, quoted |
| `status` | `verified` · `differs` · `not found` · `superseded` |
| `notes` | Anything that changes how we phrase the claim |

`differs` and `superseded` are useful results. A claim retracted before submission costs nothing.
One a judge catches costs the round.
