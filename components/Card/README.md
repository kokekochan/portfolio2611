# Card

An index card for one piece: a top bar with its Fig. number and actions, the image well, then a note block with name, medium / year and a mono technical line, with crop marks in all four corners.

- **Provide:** `<article class="pb-card">` with `.pb-card__top` (a `.pb-fig` label, an optional `.pb-iconbtn` and `.pb-check`), `.pb-card__well` (the `<img>` with real alt text, or a `pb-todo`), and `.pb-card__note` (`.pb-card__name`, `.pb-card__sub`, `.pb-card__tech`).
- **Do:** on an Ink page, put `data-theme="paper"` on each card, so paper cards sit on the dark ground. Number cards in page order (Fig. 01, 02 …). The technical line holds only real facts: size in px, tool, format, source, rights.
- **States:** `is-selected` (signal frame, signal Fig. label, hard shadow); `is-review` (dashed signal frame, for a piece that needs a decision).
- **Don't:** crop artwork to fit the well, put body paragraphs in a card, or add `pb-crt` or `pb-grain` (the corners use the same pseudo-elements).
