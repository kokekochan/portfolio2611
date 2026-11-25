# Decode

Text resolves out of random letters, digits and signs from left to right in about 0.6 seconds, as if a terminal is decoding it. Unresolved characters are signal.

- **Provide:** `data-decode` on a heading or label (plays once when it comes into view), or `data-decode="hover"` on a nav link (also replays on pointer enter). `PB.init()` wires them; `PB.decode(el, {duration, now})` plays one by hand.
- **Do:** use it on section headings (`pb-h2`) and nav links. The real text stays in place and keeps the layout; screen readers read only the real text.
- **Don't:** use it on paragraphs, captions or anything longer than one line of a heading.
- **Motion:** 45ms frames, stepped. Off under reduced motion.
