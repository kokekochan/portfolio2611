# RunningBand

A slanted full-width strip of repeated uppercase words that scrolls slowly, used between sections. The signal band leans left; `.pb-band--alt` (text-coloured) leans right.

- **Provide:** `data-words` on `.pb-band__run` with 3–5 plain words from the page itself (section names, techniques; not my name), separated by `|`. `PB.init()` fills it and pastes every fifth word in upside down.
- **Do:** put `aria-hidden="true"` on the band; it is texture. Use at most two per page, between sections.
- **Don't:** put slogans, quotes or anything not already on the page into it, or use it inside a section.
