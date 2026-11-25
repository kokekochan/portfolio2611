This is the identity for my personal portfolio and anything else that carries my name. It brings together **two clean worlds**: a structured printed zine/dossier on the page — archival paper, crop marks, sharp rules, industrial type — paired with crisp hardware terminal panels strictly inside framed screens.

## Hard rules (read these first)

1. **Mood sources stay private.** This system was built from private references (characters, games, films, brands, posters). None of them may be named, quoted or recognisable anywhere you build: no names, quotes, logos, emblems, symbols, signature motifs, distinctive silhouettes, recognisable colour-and-shape combinations or Easter eggs, in copy, navigation, titles, captions, alt text or decoration. Express mood only through the abstract qualities under **Mood**.
2. **Never invent.** No clients, credits, features, results, dates or contributions that my notes don't state. Mention AI on a piece only when my notes say it was used.
3. **Missing material gets a visible placeholder**, never filler: `pb-todo` for a missing image, `pb-ph` for missing text, written as `[What is needed]`.
4. **Only show what I supplied as portfolio work.** Reference images are not portfolio work.
5. **One accent.** `signal` is the only colour that shouts. `second-ink`, `swatch-yellow` and `swatch-magenta` are print furniture, never content colours.
6. **Texture never sits under running text.** Restrained photocopy lid shadow/grain goes around content, never behind paragraphs. Static scanlines belong strictly inside framed screen panels.
7. **My name is quiet.** "Karaya" appears at most twice on a page: the toolbar wordmark and one relabel in About. Never in bands, footers, labels or decoration.
8. **Terminal text is my own words.** Every terminal line and readout value is a plain fact from my notes. No copied system messages, boot texts, error codes, fake hacking jargon or invented numbers.
9. **No sci-fi glitch or ransom-note Dada.** No sliced glitch headlines, scrambling decode text, cut-up ransom lettering, oversized stray background letters, oscilloscope traces, upside-down band words, crooked letter jitter, masking tape, or torn paper edges.

## Content fundamentals

- **First person, plain words.** Short, direct sentences in the reader's language (German for the tailored dossier). Talk the way I'd explain it across a table to someone who doesn't code or design.
- **Direct headings, no pitch.** Use the thing's name or the question it answers. No slogans, taglines, "passionate about", or calls to action.
- **Every software/engineering project answers four questions, in this order:** *What I set out to make* (*Was ich bauen wollte*) · *What I did* (*Was ich selbst gemacht habe*) · *Where AI helped* (*Wo KI geholfen hat*) · *What works today* (*Was heute funktioniert*). A prototype adds *The part I can demonstrate* (*Was ich direkt zeigen kann*).
- **The lede is one sentence of what the tool lets someone do.**
- **Art/experiment captions are factual and visible-level**: title · medium · year, then one line on how it was made. No politics, ideology, symbolism or interpretation.
- **Casing:** labels, tags, nav and project names are uppercase through CSS; write them in normal case in the source so screen readers and copy-paste stay sane.
- **No emoji.** The only glyphs are the small square `■` (list and band separator), the arrow `→` (input to result), the signal prompt `>` (terminal commands, added by CSS) and the block cursor (`pb-cursor`).

## Mood: the qualities to reach for

- **Density against emptiness.** Packed rows of small uppercase labels and repeated upright print strips beside open fields of ground.
- **Extreme scale contrast.** A huge headline next to 13px labels, anchored by clean rules.
- **Hard edges.** Square corners (`radius-0`), solid 2–3px frames, boxed labels, hard offset shadows with no blur.
- **Printed precision & subtle photocopy wear.** Crop marks, registration swatches, restrained photocopy lid shadow on Paper edges, and one subtle off-register `second-ink` ghost on the lead headline (or clean zero-effect H1 via `.pb-h1--clean`).
- **Crisp hardware terminal.** Framed screen panels with typed mono text, blinking block cursor, tabular readouts, subtle static scanlines, and light inner vignette — sharp and legible, never blurred or flickering.
- **Aligned editorial grid.** Straight index cards (`pb-card`) with `Fig.` numbers and crop-mark corners.

## Visual foundations

### Colour
- Pages alternate between **Ink** (`ground` `#0d0c0b`, `signal` `#ff1f2d`) and **Paper** (`data-theme="paper"`, `ground` `#ece4d3`, `signal` `#b8001f`).
- `text` on `ground` or `panel` for all reading. `text-muted` for labels and captions only.
- `signal` for emphasised phrases inside running text (one per block at most), tag and band fills, the *Where AI helped* heading, placeholders, focus rings and hard shadows. Text on a signal fill is `on-signal`.
- `rule` for hairlines and dividers. A boundary that matters gets `frame`.

### Type
- Two families. `--font-sans` (Bahnschrift) for everything on paper; `--font-mono` (Cascadia Mono, then Consolas) only for screen text: terminal lines, readouts, `Fig.` numbers, and file names in window bars.
- Headings use `text-wrap: balance`. Running text stays under 62 characters wide. Captions and controls never go below 13px, and body never below 16px on a phone.

### Spacing and layout
- Gutter: at least `space-3` on phones, up to 56px on desktop, using `max(…, env(safe-area-inset-*))`. Content max width 1240px.
- **Tailored portfolio order (`index.html`):** Sticky toolbar (`Karaya` cleanly framed inside, nav tabs, dossier tally, Contact button) → **SCHEDA** on Ink (lead headline, rebuilt terminal case, screenshot window, 4-question notes, demo callout) → static print band → **Garden of Despair** on Paper (editorial spread + readout + aligned 3-card experiment plate grid) → static inverted print band → **Reverse Engineering** on Ink (spec readout, input → result frames, 4-question notes) → **Über** on Ink (relabel strip, stitch mark, bio, readout, contact) → footer → collapsed-by-default bottom-left console.

### Motion (Zine photocopy & stamp physics)
All motion is stepped (`steps()` or instant hard-snap), never smooth easing, and shows its final state immediately under `prefers-reduced-motion`.

| What | Where | Timing |
|---|---|---|
| Typing (`Terminal`) | terminal panels | 22ms/char; output lines appear whole after 90–210ms |
| Block cursor | terminal & lead label | blinks every 1.06s, `steps(1)` |
| Count-up and meters (`Readout`) | readout panels | 14 steps of 45ms; meter cells 70ms each |
| Feed (`pb-feed`) | catalogue cards | 0.42s wipe in 7 steps, 80ms apart on view |
| Stamp shift & registration snap | cards, buttons, plate frames | hard offset stamp shift + 0.12s `steps(2, end)` two-plate registration snap on hover |
| Print bands | between sections | static upright strips (no marquee scroll) |

### States
- Focus: 2px solid `signal` outline, 3px offset, on every interactive element.
- Links: underlined 1px, turning `signal` on hover. Nav tabs invert to a solid block on hover.

## Iconography
- There is no icon set and no logo. My name is set in plain type inside the toolbar frame (`pb-wordmark`) and one relabel (`pb-relabel`).
- Window controls are two plain squares (one hollow, one filled).
- `PB.stitchMark(el, seed)` makes an 11×11 mirrored stitch pattern from my display name. Use it once, in About (`Über`).

## Accessibility pairs (checked)

| Text | On | Ink | Paper |
|---|---|---|---|
| `text` | `ground` / `panel` | 15:1 / 14:1 | 14:1 / 12:1 |
| `text-muted` | `ground` / `panel` | 6.5:1 / 6.0:1 | 5.7:1 / 5.0:1 |
| `signal` | `ground` / `panel` | 5.1:1 / 4.8:1 | 5.4:1 / 4.9:1 |
| `on-signal` | `signal` | 5.1:1 | 5.4:1 |
