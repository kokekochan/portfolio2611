/** Personal Brand Design System helpers, available as window.PB after loading components/bundle.js.
 *  All terminal-layer motion is stepped, starts in view, and shows its final state under prefers-reduced-motion. */
declare namespace PB {
  /** Fill a `.pb-band__run` from its `data-words="A|B|C"`, repeated so the loop is seamless. */
  function runningBand(run: HTMLElement): void;
  /** Fill a `.pb-mark` with an 11×11 mirrored stitch pattern seeded by `seed` (default: its `data-seed`). */
  function stitchMark(el: HTMLElement, seed?: string): void;
  /** Type the `.pb-term__line` elements of a `.pb-term` one after another (`--cmd` lines character by character). `data-loop` replays it. */
  function terminal(term: HTMLElement, opts?: { speed?: number }): void;
  /** Resolve an element's text out of random characters. `data-decode="hover"` also replays on pointer enter. Returns the play function. */
  function decode(el: HTMLElement, opts?: { duration?: number; now?: boolean }): () => void;
  /** Sliced glitch bursts on one `.pb-glitch` headline, at random gaps between `min` and `max` ms (default 3800–8500). */
  function glitch(el: HTMLElement, opts?: { min?: number; max?: number }): void;
  /** Wire a `.pb-readout`: `[data-count]` counts up, `.pb-meter[data-value]` lights 0–10 cells, `[data-clock]` shows local time. */
  function readout(el: HTMLElement): void;
  /** Sweep a signal line over a grid in `canvas.pb-trace`; shape fixed by its `data-seed`. */
  function trace(canvas: HTMLCanvasElement, opts?: { sweep?: number }): void;
  /** Feed the cards of a `.pb-feed` in one after another (stepped top-to-bottom wipe) when the group comes into view. */
  function feed(el: HTMLElement, opts?: { gap?: number }): void;
  /** Add a line to a `.pb-console` log: a signal status word, then the text typed in. Keeps the newest `max` lines (default 8). */
  function log(consoleEl: HTMLElement, status: string, text: string, opts?: { max?: number }): void;
  /** Split a `.pb-dymo` label into letters that sit a pixel off their line, like a hand-cranked label maker. */
  function dymo(el: HTMLElement): void;
  /** Set a `[data-cutup]` heading's letters as if cut from different printed matter. Deterministic per word; screen readers get the plain word. */
  function cutup(el: HTMLElement): void;
  /** Run every helper on every matching element under `root` (default: document). */
  function init(root?: ParentNode): void;
}
