---
trigger: always_on
---

# PFSite — Karaya Portfolio & Design System Context

- **Active Stack & File Map:**
  - Plain static HTML, CSS, and vanilla JS (`window.PB`). No framework and no single-file artifact bundler.
  - `tokens.json` is the source of truth for Ink/Paper themes, Bahnschrift (`--font-sans`), Cascadia Mono (`--font-mono`), spacing, strokes, and hard shadows. Regenerate `tokens.css` via `py tools/build_tokens.py` (never edit `tokens.css` directly; on this Windows machine `python` hits the Store alias, so use `py`).
  - `components/bundle.css` and `components/bundle.js` hold all component styles and interactive helpers.
  - `index.html` is the tailored 3-section German portfolio prototype (`Scheda` on Ink → `Garden of Despair` on Paper → `Reverse Engineering` on Ink → `Über` on Ink).
  - `type-comparison.html` compares Variant A (subtle `second-ink` off-register ghost on lead H1 + straight embossed `pb-dymo`) against Variant B (zero letterform effects: `.pb-h1--clean` + flat `.pb-plate-tag`).
  - `system.html` is the component browser index; `_archive-v1/` holds the archived v1 files (ignored by Git).
- **Locked Design Language ("Two Clean Worlds"):**
  - Printed zine/dossier for the page + crisp hardware terminal strictly inside framed screen panels.
  - **Retired:** Do NOT use sci-fi glitch (`pb-glitch`), character scramble (`data-decode`), ransom-note cut-up (`data-cutup`), giant stray type (`pb-stray`), oscilloscope trace (`pb-trace`), upside-down band words (`is-flip`), crooked Dymo letter jitter, masking tape (`pb-tape`), torn edges (`pb-torn`), staggered/tilted cards, CRT sync-tear/flicker/rolling bar/burn-in/chromatic blur, halftone dots, or fake screws/rivets.
  - **Typography:** Keep Bahnschrift and Cascadia Mono crisp and straight. Locked choice: Variant A lead `pb-h1` (subtle `second-ink` print ghost) paired with flat `.pb-plate-tag` on hardware terminal cases (no embossed notched `.pb-dymo` plate on terminals).
  - **Motion & Scroll Choreography:** Photocopy & stamp physics — sticky Ink/Paper sheet stacking (`.pb-sheet--stack`), scroll-scrubbed two-plate press registration lock (`data-register`), pinned desktop editorial spread in `Garden of Despair` (`.pb-spread-sticky` + `.pb-fig-index`), live scroll-synced toolbar + stepped red progress rail, stepped printer-feed reveals (`pb-feed`), crisp 1–2 frame hard-snap hover states (`steps(2, end)`), static upright print bands (`.pb-band`), and typed terminal lines / blinking cursor inside crisp hardware panels. Respect `prefers-reduced-motion`.
  - **Chrome:** Sticky `.pb-toolbar` with cleanly framed `Karaya` wordmark (never clipped/bleeding); bottom-left `.pb-console` collapsed by default.
- **Hard Content & Privacy Rules:**
  - `"Karaya"` appears at most twice on a page: the toolbar wordmark and one relabel in `Über`.
  - Mood sources stay private (never name, quote, or echo them).
  - Never invent project facts, clients, stats, dates, or quotes; use `pb-ph` and `pb-todo` placeholders until Juno supplies real notes and web exports.
  - Protect originals (PSD, AI, PNG, JPG, fonts); place web-optimized exports in a separate folder when ready.
