# CRT

A worn screen for a window or terminal: scanlines in `scan`, dark corners, text that blooms and fringes red and cyan, a `phosphor` band rolling down every 8 seconds, a sync tear that jerks the picture sideways every 9.5 seconds, and an optional burn-in ghost.

- **Provide:** the class `pb-crt` on a `.pb-window`, `.pb-term` or readout panel. For burn-in, add `<span class="pb-burn" aria-hidden="true">Code</span>` right after the bar; it sits behind the live text, bottom right.
- **Do:** use it on screen panels only, so screens read as screens and paper reads as paper. Burn-in is the section's own word, never my name and never invented text.
- **Don't:** put it on the page, on Paper sections, on artwork frames, or on anything that already uses `pb-grain`.
- **Motion:** the band rolls linearly over 8s; the flicker and the sync tear are stepped. Under reduced motion only the static scanlines, corners and fringe stay.
