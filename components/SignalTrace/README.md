# SignalTrace

A signal line sweeps left to right across a 24px grid every 2.4 seconds, leaving a fading trail and a bright square head, like an oscilloscope.

- **Provide:** `<canvas class="pb-trace" data-seed="…" aria-hidden="true">` (96px tall by default). The seed (use my display name) fixes the wave's shape. `PB.trace(canvas, {sweep})` sets the sweep in ms.
- **Do:** use it as a divider between two sections, or in the empty field beside a project head. One per screen height.
- **Don't:** put it behind text, or present it as data. It is decoration, so keep `aria-hidden`.
- **Motion:** draws only while on screen. Under reduced motion it shows one still line.
