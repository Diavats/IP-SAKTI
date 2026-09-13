---
version: 1
slug: "app"
primary_target: "app"
related_targets: []
---

## Direction contract (revised — supersedes the ledger/statute-register version)

THESIS: The first direction (statute-register ledger: navy/paper/hairlines) read as generic and cold to the user despite matching Impeccable's anti-generic-dashboard rules on paper — the product is Ayurvedic and nurturing, and the UI must feel that way, not like a legal-tech spreadsheet. This revision keeps the citation-first content model but replaces the visual language entirely: warm and organic instead of austere and bureaucratic.

OWN-WORLD: warm cream ground (#F6F0E3), soil-brown ink (#3B2A1E), a deep soil-brown primary (#5C3A21) for structure (active nav, headings), and a deep red (#7A2E2E) reserved for the Sahayak agent identity and the "barred" verdict — both colors visible and purposeful, not just present. Sage green (#4B6B4F) carries the Prahari agent identity and the "open" verdict; ochre (#96701F) carries "draft/unverified." EB Garamond (serif headings) + Lato (body) + IBM Plex Mono (citations/IDs only) — unchanged from the first pass, since typography wasn't the complaint. Rounded geometry (0.75rem radius, up from 0.375rem) and a `.glass` treatment (translucent frosted panels, backdrop-blur, soft shadow) applied deliberately to chat surfaces and a few key cards — never on dense tables, where legibility wins.

STORY: unchanged in substance — a formulation owner reads a dossier like a case file — but the Ask tab is now an actual multi-turn conversation: named agents (Sahayak/Prahari) visibly announce why they engaged, a live left-hand panel shows the dossier or the Prahari search assembling in real time, answers carry a collapsed-by-default eval/confidence reveal, at least one query deliberately abstains (styled as trustworthy restraint, not an error), and a session-end report compiles every Q&A into a readable summary.

FIRST VIEWPORT: unchanged in structure (sidebar + content), restyled: warm cream throughout, brown active-nav pill, footer with About Us + contact line always present at the bottom of content.

FORM: code-led, iterated directly against user feedback on the running app (not re-routed through another Figma round) — the user asked to see live app screenshots via Playwright rather than another static mockup at this stage, given time pressure.

FINISH: unreviewed and undocumented is unfinished — this revision was verified with Playwright across 390/780/1440/3840 CSS-px widths (confirming the earlier max-width layout bug is fixed and no viewport regresses), zero console errors across all 9 routes, and the chat/Prahari/dossier-rename/footer behaviors were exercised end-to-end in a real browser, not just read from code.
