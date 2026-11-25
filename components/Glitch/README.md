# Glitch

Short sliced bursts on one headline: two copies of the text in `signal` and `second-ink` jump sideways in horizontal slices for about a quarter of a second, then the headline is still again for 4–8 seconds.

- **Provide:** the class `pb-glitch` on the lead headline (`pb-h1`). `PB.init()` copies its text into `data-text` and schedules the bursts. `PB.glitch(el, {min, max})` sets the gap in ms.
- **Do:** use it once per page, on the lead project's name only.
- **Don't:** put it on running text, links, buttons or more than one element; never make it loop faster than every 3.8s.
- **Motion:** stepped keyframes, four hard cuts per burst, no easing. Off under reduced motion.
