# AGENTS.md — Karaya design system

Read this file first. Then read `BRAND.md`.

## What this is
A design system for the portfolio of Juno Henseler (display name: **Karaya**). It is plain HTML, CSS and JavaScript. It has no build step and no framework. The look: a worn terminal dossier. Ink ground, one hot red, CRT scanlines, label-maker tape, a little Dada.

## Owner and rules for working
- The owner is a graphic designer, not an engineer. Make all technical choices yourself. Ask only about visual or product choices.
- The owner reads and writes English and German. Reply in the language the owner uses. Use short, simple sentences.
- Never overwrite or delete the owner's original files (PSD, AI, PNG, JPG, fonts). Work on copies.
- Do not push, publish or deploy without explicit approval.
- Make small commits with clear messages. Initialize git first if this folder is not a repository.
- Do not claim a check you did not do. Say what you tested and what you did not.

## Hard design rules (do not break)
1. **One accent.** Red only: `#ff1f2d` (ink) and `#b8001f` (paper). No orange. No second accent.
2. **No halftone dots. No fake screws, bolts or rivets.** The owner rejected both.
3. **The name is quiet.** "Karaya" appears at most twice on a page: the toolbar wordmark and one Relabel strip. Never in bands, burn-in, labels or decoration.
4. **Terminal text is the owner's own words.** Never invent project facts, clients, quotes or statistics. Use placeholders (`pb-ph`, `pb-todo`) when content is missing.
5. **Motion is stepped** (`steps()`), starts when the element is in view, and stops under `prefers-reduced-motion`.
6. **Texture never sits under running text.**
7. **No rounded corners.** Radius is 0 everywhere.
8. **Dada is about 15%.** Cutup headings, Stray type and flipped band words. Do not add more.
9. Mood sources are private. Do not name or link them in the output.

## File map
| Path | Role |
|---|---|
| `tokens.json` | Source of truth for colors, type, spacing, shadow, stroke, tilt. Two themes: `ink`, `paper`. |
| `tokens.css` | **Generated.** Run `python tools/build_tokens.py` after any change to `tokens.json`. |
| `components/bundle.css` | All component styles. |
| `components/bundle.js` | Sets `window.PB`. `PB.init()` wires every component. Types in `components/index.d.ts`. |
| `components/<Name>/README.md` | Rules for that component: what to provide, do, don't. |
| `components/<Name>/preview.html` | Live example of that component. |
| `components/Specimen/preview.html` | A full portfolio page that uses everything. Best test page. |
| `BRAND.md` | The brand book. |
| `_artifact/design-system.json` | Metadata from the Claude artifact. Keep it. Do not edit by hand. |

## Run it
Open a terminal in this folder (Windows):
```
python -m http.server 8080
```
Then open `http://localhost:8080/index.html`. Or use `npx serve .`.
Previews also open straight from disk (double-click), but a local server is better.

## Fonts
Not shipped. Bahnschrift (sans) and Cascadia Mono / Consolas (mono) are on Windows already. Other systems use the fallbacks in `tokens.json`. Do not add font files without the owner's approval.

## Check list before you say "done"
1. Open `components/Specimen/preview.html` at 1440, 1280, 768 and 375 px wide.
2. No sideways scroll (`document.documentElement.scrollWidth <= innerWidth`).
3. No errors in the console.
4. Turn on reduced motion. All text must show in its final state.
5. Look at screenshots. Check for clipped text, wrong spacing and misaligned layers.
6. Name count on the Specimen page is not more than two.

## Known limits
- The Specimen page uses placeholder content. Real work (SCHEDA screenshots, embroidery files) is not in this folder yet.
- Fonts depend on the viewer's system.
- Verified in headless Chromium only. Not tested in Firefox or Safari.

## Likely next jobs (only when the owner asks)
- Put real project content into the Specimen and turn it into the live portfolio.
- Port the components into the real site's codebase.
