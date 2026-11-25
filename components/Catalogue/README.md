# Catalogue

A staggered grid of index cards: every second and fourth card drops lower, and each card leans a fraction of a degree, so the grid looks pinned up by hand.

- **Provide:** `<div class="pb-catalogue">` holding `pb-card`s. Add `pb-feed` to have the cards come in one after another.
- **Do:** let the grid choose its own columns (minimum 260px a card). Keep the order the page reads in.
- **Don't:** tilt cards more than the built-in steps (−0.5° to 0.6°), or mix cards with other elements in the grid.
- **Motion (`pb-feed`):** each card wipes in from top to bottom in 7 hard steps over 0.42s, like paper out of a printer, 80ms after the one before. Off under reduced motion.
