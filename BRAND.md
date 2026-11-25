This is the identity for my personal portfolio and anything else that carries my name. It looks like a jumble of printed matter and screen panels: posters, stitched patches, woodcuts, old appliance ads and live terminal screens, pasted up on one sheet and held in line by industrial type. The paper is still; the screens on it are switched on: text types itself, headings decode, a signal trace sweeps, scanlines roll.

Nothing here is new. It should look like a system someone else built, that I found twenty years later and rebuilt into mine: screens with worn tubes in rebuilt cases, pieces held down with masking tape, old labels blacked out with marker and new ones stuck over them with a label maker, paper that has been through a copier too often. The jumble is the personality. The type, spacing and colour discipline are what keep it readable.

## Hard rules (read these first)

1. **Mood sources stay private.** This system was built from private references (characters, games, films, brands, posters). None of them may be named, quoted or recognisable anywhere you build: no names, quotes, logos, emblems, symbols, signature motifs, distinctive silhouettes, recognisable colour-and-shape combinations or Easter eggs, in copy, navigation, titles, captions, alt text or decoration. Express mood only through the abstract qualities under **Mood**. If an element starts to look like something specific, replace it with a plain design choice.
2. **Never invent.** No clients, credits, features, results, dates or contributions that my notes don't state. Mention AI on a piece only when my notes say it was used.
3. **Missing material gets a visible placeholder**, never filler: `pb-todo` for a missing image, `pb-ph` for missing text, written as `[What is needed]`.
4. **Only show what I supplied as portfolio work.** Reference images are not portfolio work.
5. **One accent.** `signal` is the only colour that shouts. `second-ink`, `swatch-yellow` and `swatch-magenta` are print furniture, never content colours.
6. **Texture never sits under running text.** Grain, photocopy speckle, tape, big words and bands go around content, not behind paragraphs. The CRT overlay is only for screen panels (windows, terminals, readouts).
7. **My name is quiet.** "Karaya" appears at most twice on a page: the toolbar wordmark and one relabel. Never in bands, burn-in, labels or decoration.
8. **Terminal text is my own words.** Every terminal line and readout value is a plain fact from my notes. No copied system messages, boot texts, error codes, fake hacking jargon or invented numbers.

## Content fundamentals

- **First person, plain words.** "I built", "I drew", "I used AI to…". Short sentences. Talk the way I'd explain it across a table to someone who doesn't code or design.
- **Direct headings, no pitch.** Use the thing's name or the question it answers. No slogans, taglines, "passionate about", or calls to action.
- **Every project answers four questions, in this order and with these exact headings:** *What I set out to make* · *What I did* · *Where AI helped* · *What works today*. A prototype adds *The part I can demonstrate*.
- **The lede is one sentence of what the tool lets someone do**, e.g. "This tool lets someone turn a photo of a receipt into a spreadsheet row." Not how it is built.
- **Art captions are factual and visible-level**: title · medium · year, then one line on how it was made, e.g. "I simplified the lettering so it stays readable when stitched." No politics, ideology, symbolism or interpretation of the aesthetic.
- **Casing:** labels, tags, nav and project names are uppercase through CSS; write them in normal case in the source so screen readers and copy-paste stay sane.
- **No emoji.** The only glyphs are the small square `■` (list and band separator), the arrow `→` (input to result), the signal prompt `>` (terminal commands, added by CSS) and the block cursor (`pb-cursor`).
- **Terminal lines** are short, lowercase commands in my words (`open project --name …`, `show screenshot`) followed by plain output lines. They say what is on the page, nothing more.

## Mood: the qualities to reach for

These are the only things taken from the references. Combine them freely; that is the point.

- **Density against emptiness.** Packed rows of small uppercase labels and repeated words beside large empty fields of ground.
- **Extreme scale contrast.** A huge headline or a giant outlined word next to 13px labels, with nothing in between.
- **Hard edges.** Square corners, solid 2–3px frames, boxed labels, hard offset shadows with no blur.
- **Printed imperfection.** Grain, photocopy speckle and lid shadow, a slightly off-register second ink, crop marks, registration swatches, torn edges.
- **Rebuilt, not new.** Masking tape on corners, a thick bezel with a vent grille, label-maker strips with crooked letters, an old label blacked out with marker and a new one stuck over it. No fake hardware: no screws, bolts or rivets. Wear is applied by hand in small doses: one or two worn details per piece, never all of them.
- **Pasted-up collage.** Small tilts (`tilt-*`), stickers overlapping corners, elements crossing a frame edge, bands running across the page at an angle.
- **Screen panels.** Interfaces framed as windows with a solid title bar, as if pinned to the sheet.
- **Live terminal.** Mono text that types itself, a blinking block cursor, uppercase readouts that count up, a signal trace sweeping a grid. Hot red phosphor on black.
- **Signal interference.** A worn tube: scanlines, dark corners, blooming text with a red and cyan fringe, a slow rolling band, a two-frame flicker, a sync tear that jerks the picture, burn-in of old text, sliced glitch bursts on the lead headline, headings decoding out of random characters.
- **A little Dada.** About 15% nonsense in the composition, never in the content: one heading per page with letters cut from different printed matter (`data-cutup`), one oversized stray glyph or word from the section crossing edges behind it (`pb-stray`), every fifth word in a band pasted in upside down. The words are always the page's own.
- **Handmade grids.** Stitch-like square grids and a mirrored pixel mark, like cross-stitch.
- **Restrained palette.** Near-black, warm off-white, one hot signal red with no orange in it. Colour only ever arrives in small, deliberate doses.

What these qualities never become: eyes, triangles, stars, crosses or other symbols; crests and emblems; lettering in other scripts used as decoration; characters, portraits or figure silhouettes; pixel-art interface frames copied from anywhere; borrowed slogans, system-message phrases or boot texts; political imagery.

## Visual foundations

### Colour
- Pages start on `ground` in the **Ink** theme. The visual-work section switches to the **Paper** theme by setting `data-theme="paper"` on its section element; everything inside re-tints from the same token names.
- `text` on `ground` or `panel` for all reading. `text-muted` for labels and captions only.
- `signal` for: emphasised phrases inside running text (one per block at most), tag and band fills, the *Where AI helped* heading, placeholders, focus rings and hard shadows. Text on a signal fill is `on-signal`.
- `rule` for hairlines and outlines that decorate. A boundary that matters gets `frame`.

### Type
- Two families. `--font-sans` (Bahnschrift) for everything on paper; `--font-mono` (Cascadia Mono, then Consolas) only for screen text: terminal lines, readouts, file names in window bars (`<code>` in a bar, or `pb-mono`). Both ship with Windows.
- Neither has a font file here: Bahnschrift's licence generally does not cover embedding on a website. On other systems the stack falls back to DIN-like faces, then the system sans. If a page must look identical everywhere, it needs a web-licensed font file: ask me for one, don't substitute silently.
- Scale: `display-xl` (once per page, lead project), `display-l` (other project names, About), `lede`, `body`, `caption`, `label`, `label-strong`; on screens `term` (14/20) and `readout` (13/16, uppercase). Use the type-style classes for size; `pb-h1` and `pb-h2` add the uppercase and the phone sizes.
- Headings get `text-wrap: balance`. Running text stays under 62 characters wide. Captions and controls never go below 13px, and body never below 16px on a phone.

### Spacing and layout
- Gutter: at least `space-3` on phones, up to 56px on desktop, always written with `max(…, env(safe-area-inset-*))`. Content max width 1240px.
- Section padding `space-6` on phones to `space-7` on desktop. Parts of one project are `space-5` apart.
- **Page order for a portfolio:** masthead (boxed name, nav) → lead coding project → further coding projects → running band → visual work on Paper → running band (alt) → About → footer.
- **The lead project gets a full row.** Its screenshot spans the content width inside a `pb-window` so the interface text can be read. Further projects use a split row: window left (1.25fr), text right (1fr). Both stack to one column under 760px.
- **Artwork is never cropped.** Masonry columns (`pb-art`, min 300px), each piece at its own proportions inside `pb-art-frame`.

### Dossier layout
Pages can also be laid out as a catalogue dossier. This layout comes from my SCHEDA project; the colours, type and motion stay this system's.
- **Every piece is an index card** (`pb-card`) with a Fig. number in page order, crop marks in its corners, the image at its own proportions and a mono technical line of real facts (size, tool, format, source, rights). On an Ink page, cards carry `data-theme="paper"`: paper cards on a dark ground.
- **Cards sit in a staggered catalogue** (`pb-catalogue`): every second and fourth card drops lower, each leans a fraction of a degree. Add `pb-feed` and they come in one after another like paper from a printer.
- **The page opens with a toolbar** (`pb-toolbar`) instead of the masthead: a sticky bar with my name huge and bleeding past its edge, boxed tabs and one signal action.
- **Sections open with a section head** (`pb-sectionhead`): rule, name, a mono line of real counts, tools on the right.
- **A console is docked bottom-left** (`pb-console`) and logs the section the visitor is reading. It starts closed on phones.
- **Page order (dossier):** toolbar → lead project with terminal → signal trace → further projects as cards → band → visual work on Paper as cards → band (alt) → About with stitch mark and readout → console. The `Specimen` card shows the whole page.

### Borders, corners, shadows
- `radius-0` everywhere.
- Windows: `stroke-frame` in `frame` plus `shadow-window`. Index cards: `stroke-heavy` in `frame`; a selected card gets `signal` and `shadow-window`. Tags: `shadow-tag`. Stickers: `shadow-sticker`. Nothing else gets a shadow.
- Note blocks are divided by `stroke-hair` in `rule`, never boxed.

### Texture
- `pb-grain` on a section adds print grain (stronger on Paper). The whole page may carry a faint fixed grain.
- `pb-h1` carries an off-register ghost in `second-ink`. Only the lead headline gets it.
- `pb-bigword`: one giant outlined word per section, bleeding off the right edge, in `rule`.
- `pb-crt` on a screen panel makes it a worn tube: scanlines in `scan`, dark corners, fringed and blooming text, a rolling `phosphor` band, a flicker and a sync tear. `pb-burn` adds burn-in.
- `pb-xerox` on a Paper section adds toner speckle and lid shadow (instead of `pb-grain`). `pb-torn` tears a paper card's bottom edge.
- `pb-tape`, `pb-dymo`, `pb-case` and `pb-relabel` are the rebuilt-by-hand details. See the Wear components.
- `data-cutup` (one heading per page) and `pb-stray` (one per section at most, outlined in `second-ink` or `rule`) are the Dada details. See the Dada components.
- Signal text and the cursor inside screens get a small `phosphor` glow. Nothing on paper glows.

### Motion
The paper layer barely moves; the screen layer is alive. All screen motion is **stepped, not smooth**: `steps()` timing, hard cuts, no easing curves, no fades longer than a frame. It runs when it comes into view, and under `prefers-reduced-motion` every piece shows its final state at once.

| What | Where | Timing |
|---|---|---|
| Typing (`Terminal`) | terminal panels | 22ms a character, small random hesitations; output lines appear whole after 90–210ms |
| Block cursor | end of a terminal, beside the lead label | blinks every 1.06s, `steps(1)` |
| Decode | section headings once; nav links on hover | 0.64s in 45ms frames, left to right |
| Glitch | lead headline only | 0.26s burst of four sliced cuts every 4–8s |
| Count-up and meters (`Readout`) | readout panels | 14 steps of 45ms; meter cells 70ms each |
| Signal trace | between sections | 2.4s sweep, only while on screen |
| CRT band, flicker, sync tear | screen panels | band 8s linear; flicker two frames every 7s; tear two frames every 9.5s |
| Feed (`pb-feed`) | catalogue cards | 0.42s wipe in 7 steps, 80ms apart, when the group comes into view |
| Console lines | docked console | typed at 14ms a character when the visitor reaches a section |
| Running bands | between sections | 60s loop |

- At most one glitch and one terminal per screen height. Motion never sits behind running text.
- Artwork shows a red/cyan registration fringe on hover. Nav links invert to a signal block on hover, like a selected line.

### States
- Focus: 2px solid `signal` outline, 3px offset, on every interactive element.
- Links: underlined 1px, turning `signal` on hover. Nav links: a signal block with `on-signal` text on hover.

## Iconography
- There is no icon set and no logo. My name is set in plain type inside a 2px box (`pb-name`). Don't draw a mark.
- Window controls are two plain squares (one hollow, one filled), not a close or minimise glyph.
- `PB.stitchMark(el, seed)` makes an 11×11 mirrored stitch pattern from my display name. It is the closest thing to a personal mark and changes when the name changes. Use it once, in About.

## Accessibility pairs (checked)

| Text | On | Ink | Paper |
|---|---|---|---|
| `text` | `ground` / `panel` | 15:1 / 14:1 | 14:1 / 12:1 |
| `text-muted` | `ground` / `panel` | 6.5:1 / 6.0:1 | 5.7:1 / 5.0:1 |
| `signal` | `ground` / `panel` | 5.1:1 / 4.8:1 | 5.4:1 / 4.9:1 |
| `on-signal` | `signal` | 5.1:1 | 5.4:1 |

`phosphor`, `scan`, `trace-grid`, `tape` and `redact` are decoration only and never carry text.

## Using this system in a page
- Load `tokens.css`, `components/bundle.css` and `components/bundle.js` (sets `window.PB`; no React needed). `PB.init()` wires bands, the stitch mark, the terminal layer (terminals, decode, glitch, readouts, traces), the dossier feed, label-maker strips and cut-up headings.
- Wrap the page in `class="pb-page"`. Each component's card below shows its markup.
