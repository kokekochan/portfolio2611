# Readout

Label and value rows in uppercase mono, like a status panel: numbers count up in steps, meters light cell by cell, and a clock can show the visitor's local time.

- **Provide:** a `<dl class="pb-readout">` of `<dt>`/`<dd>` pairs. `dd[data-count="12"]` counts up (`data-pad` sets zero padding), `span.pb-meter[data-value="0.6"]` lights 6 of 10 cells, `dd[data-clock]` ticks the local time. `is-hl` makes one value signal.
- **Do:** fill it only with real facts from my notes (number of pieces, years, sizes, formats, tools) or the live clock. Missing facts get `pb-ph` placeholders. Put it in a window with `pb-crt`.
- **Don't:** invent stats, percentages, scores or progress. A meter shows a real share (for example 6 of 10 pieces digitized) or is left out.
- **Motion:** counts in 14 steps of 45ms; meters light at 70ms a cell; both start in view. Final values at once under reduced motion.
