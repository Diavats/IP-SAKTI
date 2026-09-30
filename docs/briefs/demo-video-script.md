# SAMHITĀ — Motion Graphics Script

**Runtime 2:35 (155s). VO ≈ 355 words at ~140 wpm.**
**Product on screen at 0:28.** The problem statement already exists and the
judges wrote it — the setup earns attention, it does not explain the sector.

Format: motion graphics. Product shots are composited frames inside the
animation, never a cursor tour.

Three columns per beat: **VISUAL** · **ON-SCREEN** (sparse kinetic type) · **VO**.

Live build: https://samhita-indol.vercel.app

---

# 1 · HOOK — 0:00–0:12

**VISUAL**
Black. One line of a patent journal types on in monospace. Then another. Then
twenty, cascading until the frame is a wall of application numbers. All of it
drains except a single highlighted row, pulsing.

**ON-SCREEN**
`EVERY FRIDAY.` → then the lone record.

**VO**
> Every Friday, India publishes a list of new patent applications.
>
> Some of them claim knowledge this country has held for a thousand years.
> Almost nobody is reading the list.

---

# 2 · THE STAKES — 0:12–0:28

Problem and mechanism in one beat. The comparison does the persuading; the
timeline does the explaining.

**VISUAL**
Two calendars burn in parallel — one through twelve months, one through ten
years — and collide on a gavel. Hard cut: a timeline draws itself, three
markers landing with weight. **Publication**, a shaded six-month band,
**Earliest grant**. A counter inside the band starts ticking down.

**ON-SCREEN**
`TURMERIC · ~1 YEAR` | `NEEM · 1995 → 2005`
then `s.11A publishes` · `Rule 55(1A) — no grant for six months` ·
`s.25(1) — any person may object`

**VO**
> India has fought these before. Turmeric fell in about a year. Neem took ten —
> same evidence, but neem was fought after the patent was granted.
>
> Before grant, you file a form. After grant, you file a lawsuit.
>
> The law leaves exactly one cheap moment: six months from publication, when any
> person can object. It is invisible unless someone is counting.

---

# 3 · SOLUTION — 0:28–0:38

**VISUAL**
The six-month band on the timeline contracts and resolves into the SAMHITĀ
mark — the window literally becomes the logo. Two glyphs split out: a leaf, a
pair of binoculars.

**ON-SCREEN**
`SAMHITĀ · संहिता`
`One knowledge graph. Two agents.`

**VO**
> SAMHITĀ reads the list. Every Friday. And it starts the countdown.
>
> Sahayak tells you what you can protect. Prahari watches what someone else is
> trying to claim.

"Claim", not "take": a s.25(1) representation accuses nobody (see Non-negotiables),
and "claim" is the accurate patent term.

---

# 4 · DEMO · PRAHARI — 0:38–1:25

The largest block. It is the only thing here a competing team cannot reproduce.

**VISUAL**
Journal page → funnel labelled `IPC A61K36` → records drop through. Each card
assembles: application number, species, and a countdown that visibly
decrements. Cards self-sort, most urgent rising to the top. One card flips into
a filled Form 7A.

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
> Then it drafts the objection, with the sources cited. A human signs it. Nothing
> files itself.

---

# 5 · DEMO · SAHAYAK — 1:25–1:55

**VISUAL**
A formulation card drops in. Seven regime tiles fan out. Six turn emerald, one
turns red and stamps `s.3(p)`. The six then reorder into a numbered queue, each
gaining a cost and a clock.

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
> are open, and the order *is* the advice: a trade secret costs nothing and dies
> the moment you disclose; a trademark has months of pendency, so that clock
> starts now.

---

# 6 · PROOF — 1:55–2:17

**VISUAL**
Language toggle flips: sidebar labels morph through हिन्दी, മലയാളം, தமிழ் while a
citation chip in the same frame stays completely still. Hard cut to the evals
board, one card deliberately greyed.

**ON-SCREEN**
`THE INTERFACE TRANSLATES.` / `THE STATUTE DOES NOT.`
then `MULTILINGUAL — NOT YET MEASURED`

**VO**
> Four languages. The citations never move — a translated statute is not the
> statute.
>
> And we publish what we have not measured yet, in the same place we publish what
> we have. Every number on that page can be checked. That is the point.

---

# 7 · WRAP + CTA — 2:17–2:35

**VISUAL**
Pull back to the beat-2 timeline, now populated with live counting cards.
Everything falls away except the countdown, still running under the end card.

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
occurrences, including on-screen text and file names. A Section 25(1)
representation submits prior art; it accuses nobody. Legal exposure, not tone.

**No invented metrics.** Nothing claims an accuracy, precision or quality
figure. Every number spoken is external and checkable: turmeric and neem,
the statutory periods. The greyed evals card is deliberate — do not "fix" it
in the edit.

**Sample, not sweep.** If the alert records are described, they are a
representative sample in Journal format. The parser is future work; the window
arithmetic on top of it is real and unit-tested. Keeping that line clean is what
lets the claim survive a follow-up.

**No TKDL claim.** Never imply the system searches it. It is closed under
agreement to seventeen patent offices. Other teams claim this; it is checkable.

**One shader button** per product frame (§9).

---

# Shot list — composited product frames

Capture at **1600×900**, 100% zoom, private window.

1. Landing hero, red "windows closing" pill visible
2. Prahari list sorted, showing 6d / 23d / 46d / 152d
3. One alert open at the drafted Form 7A
4. A dossier's seven-regime map, patent tile barred
5. Language switcher open **with a citation chip in the same frame**
6. `/evals` with the greyed multilingual card

Shot 5 carries beat 6 entirely. The contrast only works if the changing chrome
and the unchanged citation are in one frame — two cuts will not sell it.
