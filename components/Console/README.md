# Console

A log panel docked to the bottom-left corner of a page: a signal summary strip that opens and closes, a progress bar and a list of short mono lines, each with a signal status word. It is where the terminal layer lives on a full page.

- **Provide:** `<details class="pb-console">` with a `<summary>` and a `.pb-console__body` holding an optional `<progress>` (with `aria-label`) and a `ul.pb-console__log`. Each `<li>` is `<b>status</b>text`; `is-dim` quietens a line. `pb-console--inline` places it in the flow instead of fixed.
- **Live lines:** `PB.log(consoleEl, 'show', 'text')` adds a line at the top and types it in; `{max: 8}` keeps the newest eight. Drive it from what the visitor does (the section in view, the piece they opened), never from invented events.
- **Do:** keep status words to one short lowercase verb of my own (`open`, `show`, `next`). Start it closed on phones.
- **Don't:** use more than one console on a page, or fill it with fake system output.
