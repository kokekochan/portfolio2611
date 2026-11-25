# Terminal

A window whose body is live mono text: command lines type in one character at a time, output lines appear whole, and a blinking signal block cursor waits at the end.

- **Provide:** a `.pb-window.pb-term` with a bar, a `.pb-term__body` of `<p class="pb-term__line">` lines, and an optional `.pb-term__status` row. Mark commands with `--cmd` (gets the signal `>` prompt), quiet lines with `--dim`, the one important line with `--hl`. Add `data-loop` to replay it. Load `bundle.js` and call `PB.init()`.
- **Do:** write every line in my own plain words, as short facts from my notes (a project's four answers, a file list, a step I took). Keep it to 4–8 lines. Add `pb-crt` for scanlines.
- **Don't:** copy system messages, error codes or boot texts from anywhere, invent numbers, or use it for long paragraphs. One terminal per screen height at most.
- **Motion:** commands type at 22ms a character with small random hesitations; output appears after 90–210ms. Starts when it comes into view. Under reduced motion all lines show at once. Screen readers get the full text in one hidden copy.
