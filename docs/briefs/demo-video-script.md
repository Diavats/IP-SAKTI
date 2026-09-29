# Demo Video Script — SAMHITĀ

**Target length: 2 minutes 30 seconds.** Judges watch a lot of these. A tight 2:30 that
lands one idea beats a 5:00 that tours every screen.

**Record at 1600x900.** Screenshots from this recording go into 16:9 slides.

**Before recording:** `npm run build && npm start`, not `npm run dev`. The dev overlay
and fast-refresh flashes look unfinished on camera.

---

## The one rule for this video

A judge should be able to say, afterwards, **"they're the ones who catch bad patents
during the objection window."**

Not "an AI assistant for Ayurveda IP." Fifteen other teams are that. Every second of
this script exists to land the window.

---

## 0:00–0:25 · The problem, with numbers

**On screen:** title card, then the home page.

> India has fought these patents before and won. Turmeric took about a year and roughly
> ten thousand dollars, because CSIR already had thirty-two prior-art references
> documented and ready to file.
>
> Neem took ten. Nineteen ninety-five to March two thousand five. Same country, same
> prior art. The difference was timing. Neem was fought after the patent was granted.

**Do not** say biopiracy, misappropriation, stolen or theft. Not once, not casually.
It is a liability question, not a style one.

---

## 0:25–0:45 · What the window is

**On screen:** the statutory timeline, or the Prahari page with one alert visible.

> An Indian patent application publishes at eighteen months under Section 11A. Rule
> 55(1A) then bars any grant for six months. Inside that window, Section 25(1) lets
> any person object, on Form 7A.
>
> Before grant, stopping a bad patent costs a form. After grant it costs a lawsuit.
> That six-month gap is the whole product.

---

## 0:45–1:35 · Prahari — the money shot

This is the segment that wins or loses the video. Give it the most time.

**On screen:** `/prahari`. Click **Replay last sweep**, let the steps animate through.

> Prahari reads the Patent Office Journal, filtered to IPC A61K36. It runs on a
> schedule. Nobody asks it to.

**On screen:** the alert list, sorted urgency-first. Pause on the top row.

> These are the applications it surfaced. They are ranked by how soon the window
> shuts, not by how good the match is, because a closing window outranks a
> marginally better match.

**On screen:** point at the countdown on the top alert.

> This number is computed, not stored. Publication date plus six months under Rule
> 55(1A), measured against today. If you open this tomorrow it reads one day less.

**Say this line. It is the single most defensible sentence in the video.**

**On screen:** open one alert, scroll to the drafted Form 7A.

> And it drafts the representation, with the Formulary passages cited. A human
> reviews it. Nothing is ever filed automatically.

---

## 1:35–2:10 · Sahayak — what to do Monday

**On screen:** a dossier, then the protection map.

> The other half answers the question an MSME actually has. Not "is this patentable",
> but "what do I do".

**On screen:** the seven-regime map, then the filing sequence.

> Patent is barred here, under Section 3(p), with the section cited. But six other
> regimes are open, and the order matters. Trade secret costs nothing and closes by
> itself the moment you disclose. The trademark has months of pendency, so that clock
> starts now.

> Every line carries the provision it rests on. Where the system is not confident, it
> abstains and routes to a human instead of guessing.

---

## 2:10–2:30 · Honesty, which is a feature

**On screen:** `/evals`.

> We report on the four axes the problem statement names. The multilingual card says
> "not yet measured", because it is not built yet.

**Leave that card on screen for a full beat.** Do not skip past it.

> We would rather show you what we have not measured than a number we cannot defend.

**On screen:** back to the Prahari countdown for the last shot.

> Fifteen teams are building an assistant for this problem statement. The deadline is
> the part nobody else is computing.

---

## What NOT to show

| Skip | Why |
|---|---|
| The knowledge graph page | Every team's node-link picture looks identical. Costs 20 seconds, adds nothing. |
| The settings page | Nobody cares. |
| Every route in sequence | A tour is not a demo. Three moments, done well. |
| Any accuracy percentage | We have not measured it. Saying a number here undoes the `/evals` segment. |
| The `/ask` chat at length | It is the most ChatGPT-looking screen we have. Ten seconds maximum, if at all. |

---

## Honesty guardrails, non-negotiable

Say **"a representative sample in Journal format"** if you refer to where the alert
records come from. The Journal parser is Week 2 work and does not exist. The window
arithmetic on top of those records is genuinely real and unit-tested, and that
distinction is exactly what makes the claim survive a question.

Never say the system "monitors patents globally" or "searches TKDL". TKDL is closed
under agreement to seventeen patent offices and nobody has access without one.
Competing repos claim this. It is checkable, and it is the kind of claim that costs a
round when checked.

---

## Recording checklist

- [ ] Production build running, not dev
- [ ] Browser at 1600x900, no bookmarks bar, no extensions visible
- [ ] Zoom at exactly 100%
- [ ] Prahari page loaded once before recording so data is warm
- [ ] Script read aloud twice before the take; if a sentence trips you, cut it
- [ ] One take per segment, stitched, rather than one continuous run
- [ ] Watch it once on mute — if the screen alone does not tell the story, re-record
