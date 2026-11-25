# AGENTS.md — Karaya design system

Read this file first. Then read `BRAND.md`.

## What this is
A design system and tailored portfolio for Juno Henseler (display name: **Karaya**). Plain HTML, CSS, and JavaScript with no framework. The aesthetic is **two clean worlds**: a structured printed zine/dossier on the page, paired with crisp hardware terminal panels strictly inside framed screens.

## Owner and rules for working
- The owner is a graphic designer, not an engineer. Make all technical choices yourself. Ask only about visual or product choices.
- The owner reads and writes English and German. Reply in the language the owner uses. Use short, simple sentences.
- Never overwrite or delete the owner's original files (PSD, AI, PNG, JPG, fonts). Work on copies.
- Do not push, publish or deploy without explicit approval.
- Make small commits with clear messages.
- Do not claim a check you did not do. Say what you tested and what you did not.

## Hard design rules (do not break)
1. **One accent.** Red only: `#ff1f2d` (ink) and `#b8001f` (paper). No orange. No second accent.
2. **Two clean worlds — no sci-fi glitch or ransom-note Dada.** No halftone dots, no fake screws/bolts/rivets, no glitch slices (`pb-glitch`), no character decode scrambles (`data-decode`), no cut-up ransom letters (`data-cutup`), no stray background letters (`pb-stray`), no oscilloscope traces (`pb-trace`), no upside-down band words, no crooked letter jitter on label strips, no masking tape, and no torn edges.
3. **Structured grid & crisp typography.** Cards sit on a straight, aligned grid (no staggered vertical offsets or tilted cards). Keep Bahnschrift and Cascadia Mono straight and unaltered everywhere; only the lead `pb-h1` carries a single subtle `second-ink` print-registration ghost (`.pb-h1--clean` removes even that).
4. **Crisp hardware terminals.** Framed screen panels keep typed mono lines, blinking block cursor, tabular readouts, subtle static scanlines, and a light inner vignette. No CRT sync-tear skew, flicker, rolling bar, burn-in ghost, or chromatic text blur.
5. **Zine-like stepped motion.** Use stepped printer-feed reveals (`pb-feed`), crisp 1–2 frame hard-snap hover states (`steps(2, end)` stamp shifts and two-plate registration snaps), and static upright print bands. Everything shows its final state at once under `prefers-reduced-motion`.
6. **The name is quiet.** "Karaya" appears at most twice on a page: the toolbar wordmark (cleanly framed inside the bar, never bleeding or clipped) and one relabel strip in About (`Über`). Never in bands, footers, labels, or decoration.
7. **Docked console starts closed.** The bottom-left `.pb-console` stays collapsed by default until clicked.
8. **Own words & honest placeholders.** Never invent project facts, clients, quotes, dates, or statistics. Use placeholders (`pb-ph`, `pb-todo`) when content is missing.
9. **Texture never sits under running text.** Restrained photocopy lid shadow/grain goes around content, never obscuring paragraphs.
10. **No rounded corners.** Radius is 0 everywhere.
11. **Mood sources are private.** Do not name, quote, or echo them anywhere.

## File map
| Path | Role |
|---|---|
| `index.html` | Tailored 3-section German portfolio (`Scheda` → `Garden of Despair` → `Reverse Engineering` → `Über`). |
| `type-comparison.html` | Side-by-side / stacked comparison of Variant A (subtle H1 ghost) vs. Variant B (zero letterform effects). |
| `system.html` | Component browser index linking to all component previews. |
| `tokens.json` | Source of truth for colors, type, spacing, shadow, stroke, tilt. Two themes: `ink`, `paper`. |
| `tokens.css` | **Generated.** Run `py tools/build_tokens.py` after any change to `tokens.json`. |
| `components/bundle.css` | All component styles. |
| `components/bundle.js` | Sets `window.PB`. `PB.init()` wires active zine & terminal helpers. Types in `components/index.d.ts`. |
| `components/<Name>/README.md` | Rules for that component. |
| `components/<Name>/preview.html` | Standalone example of that component. |
| `BRAND.md` | The brand book. |
| `_artifact/design-system.json` | Metadata from the Claude artifact. Keep it. Do not edit by hand. |
| `_archive-v1/` | Archived v1 files (ignored by Git). |

## Run it
Open a terminal in this folder (Windows):
```
py -m http.server 8080
```
Then open `http://localhost:8080/index.html` (or `type-comparison.html`, `system.html`).

## Fonts
Not shipped. Bahnschrift (sans) and Cascadia Mono / Consolas (mono) are on Windows already. Other systems use the fallbacks in `tokens.json`. Do not add font files without the owner's approval.

## Check list before you say "done"
1. Open `index.html` at 1440, 1280, 768 and 375 px wide.
2. No sideways scroll (`document.documentElement.scrollWidth <= innerWidth`).
3. No errors in the console.
4. Turn on reduced motion. All text and cards must show in their final state.
5. Bottom-left console starts closed (`open === false`), toolbar wordmark fits cleanly inside the bar, and Paper cards align on a straight grid.
6. Look at screenshots. Check for clipped text, wrong spacing and misaligned layers.
7. Name count ("Karaya") on `index.html` is not more than two.

## Known limits
- `index.html` currently uses German placeholder content (`pb-ph`, `pb-todo`) until design language sign-off and real content entry.
- Fonts depend on the viewer's system.
