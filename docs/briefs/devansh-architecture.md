# Note — Architecture diagram fixes (Devansh)

**About:** the architecture image going onto slide 3 of the SIH idea deck.
**Why now:** the deck claims something the diagram currently contradicts.
**Priority:** item 1 before submission. Items 2 to 6 if there is time.

The diagram is good. The layout reads cleanly, the deterministic layers are separated properly, and
the example query is well chosen. Everything below is about making it agree with what the deck says.

---

## 1. Prahari is drawn inside the query path, and it should not be

### The problem

Right now Prahari sits in the "Agents & Tools (Activated as needed)" row, and the only arrows
reaching that row come down from the Query Triage and Depth Controller. Read literally, the diagram
says a user query activates Prahari.

`SAMHITA-PLAN.md` §2.1 says the opposite:

> Scheduler (Fridays) --> Prahari ----> | <- second entry point, never in the query path

Slide 2 of the deck claims Prahari acts unprompted. That is the whole USP. A judge who reads slide 2
and then looks at slide 3 finds them disagreeing, and the thing that breaks is the differentiator.

This matters more than it did last week. I scanned the public GitHub repos on PS 26045 and found
around fifteen teams building this. Several have a watcher of some kind. What none of them have is a
watcher that fires on its own schedule and computes a statutory deadline. If our diagram shows
Prahari as query-triggered, we look like the rest of them.

### The fix

Add a second entry point on the left of the "Agents & Tools" row, feeding Prahari directly and
bypassing User Query, Orchestrator and the Depth Controller:

```
   Scheduler                 ┌─────────────────────────────────────────┐
   Every Friday  ──────────▶ │  Prahari Agent                          │
   Patent Office Journal     │  (inside Agents & Tools)                │
                             └─────────────────────────────────────────┘
```

Visually it should be obvious that this arrow does not come from the top of the page. A different
arrow style for the scheduled path, against the query path, would make it read at a glance.

### Fallback if there is no time

A caption under the image, which Vansh can add without touching the artwork:

```
Sahayak answers queries. Prahari runs from a weekly scheduler and is never
triggered by a user query.
```

Weaker than fixing the arrow, but it closes the contradiction.

---

## 2. The diagram labels five things "Agent". The deck says two.

Slide 2's heading is "ONE DOSSIER, TWO AGENTS." The diagram shows Orchestrator Agent, Sahayak Agent,
Prahari Agent, Tool Agents and Verification Agent. Anyone counting gets five.

Both are defensible on their own. Sahayak and Prahari are the two agents that produce user-facing
output, and the rest are pipeline stages. The problem is only that the slide never says so, and the
diagram never distinguishes them.

Two ways to fix, and they work together:

**Cheap, no artwork change.** Vansh adds a sub-line on slide 2 saying the two agents are the two the
user meets, and that orchestration, tools and verification are pipeline stages. I have put this in
his brief already.

**Better, if you are redrawing anyway.** Group Sahayak and Prahari visually as the two product
agents, and let the Orchestrator, Tool Agents and Verification Agent read as infrastructure. A
grouping box or a weight difference is enough. Do not rename Tool Agents, because `CLAUDE.md` §2
records it as a distinct agent and that reading is settled.

---

## 3. "Attack Mode (examiner view)" should read "Examiner View"

Our fixed terminology across `PRODUCT.md` and the deck is Examiner View. Two names for one feature
looks unfinished.

Separately, "attack mode" is combative language for a tool built for a ministry whose entire legal
posture is that we submit prior art rather than attack anyone. The same instinct that keeps
"biopiracy" out of the product applies here.

---

## 4. "Find similar patents globally" overstates what we build

Foreign filing search is the stretch stream. The primary stream is the domestic Journal, and that is
deliberate, because India can act on a domestic application for the cost of a form.

Suggested replacement inside the Deep Research box: **"Find similar published applications"**.

Worth knowing: the competing repos mostly went the other way and lead with global or international
monitoring. One of them cross-references TKDL, which nobody can actually access. Our domestic focus
is the stronger position and the diagram should not blur it.

---

## 5. The multilingual chip needs to become four named languages

It currently reads `EN | HI | संस्कृत | अन्य`. Two problems. "अन्य" is not a language, and Sanskrit
is not a language anyone will type a query in.

Change to four named languages:

```
EN  |  हिन्दी  |  മലയാളം  |  தமிழ்
```

The reasoning, which is worth having ready: Kerala and Tamil Nadu carry dense Ayurveda and Siddha
manufacturing and practice, so Malayalam and Tamil reach real users rather than filling a slide.
Hindi covers the northern manufacturing belt. English is the language the statutes are in.

Sanskrit keeps a role, just a different one. Classical citations display in their authentic form
rather than being translated, which is already our stated rule. If there is room, a small note
saying citations are shown in the source language covers it better than listing Sanskrit as a UI
language.

One competing repo claims 13 languages. We are not competing on count. Four we can name a reason for
beats thirteen we cannot measure.

---

## 6. The top-left callout reads as a pipeline stage

The box saying "System gives the right depth answer, no unnecessary heavy research" is joined to the
flow with a dashed connector, so it looks like a processing step. `CLAUDE.md` §2 already notes it is
an annotation on the Depth Controller rather than a real data-flow edge.

Restyle as a floating note with no connector, or drop it. As drawn, someone will ask what that stage
does.

---

## 7. Two things to leave exactly as they are

**The example query.** "Can I patent my polyherbal formulation containing Ashwagandha, Guduchi and
Turmeric?" is well chosen. Polyherbal is precisely what Section 3(e) refuses as a mere admixture, so
it lines up with the worked example on slide 2. Do not change it.

**The Verification Agent box**, except to make it heavier. It is the strongest architectural claim we
have and it is currently the same visual weight as everything else. A stronger border or fill would
help the eye land on it.

---

## Handover

The image is not in the repo. Vansh needs the file from you directly, at the highest resolution you
have, for full-width placement on slide 3.

If you only have time for one thing, do item 1.
