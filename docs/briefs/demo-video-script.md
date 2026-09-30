# SAMHITĀ — Motion Graphics Script

**Runtime 2:40 (160s). VO ≈ 370 words at ~140 wpm.**
Format: motion graphics, not a screen recording. Product shots appear as
composited frames inside the animation, not as a cursor tour.

Three columns per beat: **VISUAL** (what the animation does) · **ON-SCREEN**
(kinetic type, sparse) · **VO** (what is spoken).

Live build: https://samhita-indol.vercel.app

---

# 1 · HOOK — 0:00–0:15

**VISUAL**
Black. A single line of a government journal page types itself on, monospace,
one record. Then a second. Then twenty, cascading fast until the screen is a
wall of application numbers. Everything drains away except one highlighted row.

**ON-SCREEN**
`FRIDAY.` → `EVERY FRIDAY.` → then the lone record, pulsing.

**VO**
> Every Friday, India publishes a list of new patent applications.
>
> Some of them claim knowledge this country has held for a thousand years.
>
> There is a six-month window to object. Almost nobody is reading the list.

---

# 2 · PROBLEM — 0:15–0:35

**VISUAL**
Split screen. Left: a calendar burning through twelve months, a small ₹ counter
ticking gently. Right: the same calendar burning through **ten years**, the
counter spiralling. Both land on a gavel.

**ON-SCREEN**
Left `TURMERIC · ~1 YEAR · ~$10,000`
Right `NEEM · 1995 → 2005`
Then, centred: `SAME PRIOR ART. DIFFERENT TIMING.`

**VO**
> India has fought these before. Turmeric fell in about a year, for roughly ten
> thousand dollars, because the prior art was already documented and ready to
> file.
>
> Neem took ten years. Same country. Same evidence. The difference was that neem
> was fought *after* the patent was granted.
>
> Before grant, you file a form. After grant, you file a lawsuit.

---

# 3 · THE TURN — 0:35–0:50

**VISUAL**
A clean horizontal timeline draws itself left to right. Three markers land with
weight: **Publication**, a shaded six-month band, **Earliest grant**. The band
glows. A counter inside it starts ticking *down*.

**ON-SCREEN**
`s.11A — publishes` · `s.25(1) — any person may object` · `Rule 55(1A) — no
grant for six months`

**VO**
> That gap has a name in law. An application publishes under Section 11A. Rule
> 55(1A) blocks any grant for six months. Inside it, Section 25(1) lets *any
> person* object.
>
> It is the cheapest moment in the entire system. And it is invisible unless
> someone is counting.

---

# 4 · SOLUTION — 0:50–1:05

**VISUAL**
The SAMHITĀ mark resolves out of the timeline's six-month band — the band
literally becomes the logo. Two agent glyphs split from it: a leaf, and a pair
of binoculars.

**ON-SCREEN**
`SAMHITĀ · संहिता`
`One knowledge graph. Two agents.`

**VO**
> SAMHITĀ reads the list. Every Friday. And it starts the countdown.
>
> Two agents on one knowledge graph. Sahayak tells you what you can protect.
> Prahari watches what someone else is trying to take.

---

# 5 · DEMO · PRAHARI — 1:05–1:40

Give this the most room. It is the only thing in the video no other team can
show.

**VISUAL**
Journal page → funnel labelled `IPC A61K36` → a handful of records fall
through. Each card assembles: application number, species, and a **live
countdown** that visibly decrements. Cards self-sort, most urgent rising.
One card flips over into a filled Form 7A.

**ON-SCREEN**
`6 days` (red) · `23 days` (red) · `46 days` (amber) · `152 days` (green)
then `DRAFT — HUMAN REVIEW REQUIRED`

**VO**
> Prahari sweeps the Patent Office Journal, filtered to the classification that
> covers plant-based medicine.
>
> Every match gets a deadline. Not a risk score — a date. Publication plus six
> months, measured against today. Open it tomorrow and every number is one lower.
>
> They sort by which door shuts first, because a closing window beats a slightly
> better match.
>
> Then it drafts the objection, with the sources cited. A human signs it.
> Nothing files itself.

---

# 6 · DEMO · SAHAYAK — 1:40–2:05

**VISUAL**
A formulation card drops in. Seven regime tiles fan out around it. Six turn
emerald. One turns red and stamps `s.3(p)`. The six then **reorder themselves
into a numbered queue**, each gaining a cost and a clock.

**ON-SCREEN**
`PATENT — BARRED s.3(p)`
`1. Trade secret — today — ₹0`
`2. Trademark — this week`
`3. Design · GI · Copyright · Plant variety`

**VO**
> Sahayak answers the question a small manufacturer actually has. Not "is this
> patentable" — "what do I do on Monday".
>
> Patent is barred here, and it names the section that bars it. Six other routes
> are open, and the order is the advice: your trade secret costs nothing and
> dies the moment you disclose. Your trademark has months of pendency, so that
> clock starts now.

---

# 7 · PROOF — 2:05–2:25

**VISUAL**
Language toggle flips: sidebar labels morph through हिन्दी, മലയാളം, தமிழ் — while
a citation chip in frame stays **completely still**. Hard cut to the evals
board, where one card is deliberately greyed.

**ON-SCREEN**
`THE INTERFACE TRANSLATES.` / `THE STATUTE DOES NOT.`
then `MULTILINGUAL — NOT YET MEASURED`

**VO**
> Four languages. But the citations never move — a translated statute is not the
> statute.
>
> And we publish what we have not measured yet, in the same place we publish
> what we have. You can check every number on this page. That is the point.

---

# 8 · WRAP + CTA — 2:25–2:40

**VISUAL**
Pull back to the timeline from beat 3, now populated with live counting cards.
Everything else falls away. The countdown keeps running under the end card.

**ON-SCREEN**
`SAMHITĀ · संहिता`
`samhita-indol.vercel.app`
`SIH 2026 · PS 26045 · Ministry of AYUSH`

**VO**
> A patent office publishes a list every Friday. The window to answer it is six
> months, and it has already started.
>
> SAMHITĀ is counting. Come and look.

---

# Non-negotiables

**Banned words.** biopiracy · misappropriation · stolen · theft. Zero
occurrences, including in on-screen text and file names. A Section 25(1)
representation submits prior art; it accuses nobody. This is legal exposure,
not tone.

**No invented metrics.** Nothing claims an accuracy, precision or quality
figure. Every number spoken is external and checkable: turmeric's cost and
duration, neem's dates, the statutory periods. The greyed evals card is
deliberate — do not "fix" it in the edit.

**Sample, not sweep.** If the alert records are described at all, they are a
representative sample in Journal format. The parser is future work. The window
arithmetic on top of them is real and unit-tested, and keeping that line clean
is what lets the claim survive a follow-up question.

**No TKDL claim.** Never imply the system searches it. It is closed under
agreement to seventeen patent offices. Other teams claim this; it is checkable.

**One instance of the shader button** in any product shot (§9).

---

# Shot list for composited product frames

Capture at **1600×900**, 100% zoom, private window. These are the only real UI
frames the animation needs:

1. Landing hero with the red "windows closing" pill visible
2. Prahari list, sorted, showing 6d / 23d / 46d / 152d
3. One alert open at the drafted Form 7A
4. A dossier's seven-regime map with the patent tile barred
5. Language switcher open, with a citation chip in the same frame
6. `/evals` with the greyed multilingual card

Shot 5 matters most: the animation is built on the contrast between chrome that
changes and a citation that does not. Both must be in one frame.
