/** Personal Brand Design System helpers, available as window.PB after loading components/bundle.js.
 *  All motion is stepped, starts in view, and shows its final state under prefers-reduced-motion. */
declare namespace PB {
  /** Fill a `.pb-band__run` from its `data-words="A|B|C"` with upright words for a static zine divider strip. */
  function runningBand(run: HTMLElement): void;
  /** Fill a `.pb-mark` with an 11×11 mirrored stitch pattern seeded by `seed` (default: its `data-seed`). */
  function stitchMark(el: HTMLElement, seed?: string): void;
  /** Type the `.pb-term__line` elements of a `.pb-term` one after another (`--cmd` lines character by character). `data-loop` replays it. */
  function terminal(term: HTMLElement, opts?: { speed?: number }): void;
  /** Wire a `.pb-readout`: `[data-count]` counts up, `.pb-meter[data-value]` lights 0–10 cells, `[data-clock]` shows local time. */
  function readout(el: HTMLElement): void;
  /** Feed the cards of a `.pb-feed` in one after another (stepped top-to-bottom wipe) when the group comes into view. */
  function feed(el: HTMLElement, opts?: { gap?: number }): void;
  /** Add a line to a `.pb-console` log: a signal status word, then the text typed in. Keeps the newest `max` lines (default 8). */
  function log(consoleEl: HTMLElement, status: string, text: string, opts?: { max?: number }): void;
  /** Retired sci-fi/Dada helpers kept as safe no-ops for backward compatibility. */
  function decode(el: HTMLElement, opts?: { duration?: number; now?: boolean }): () => void;
  function glitch(el: HTMLElement, opts?: { min?: number; max?: number }): void;
  function trace(canvas: HTMLCanvasElement, opts?: { sweep?: number }): void;
  function dymo(el: HTMLElement): void;
  function cutup(el: HTMLElement): void;
  /** Run every active helper on every matching element under `root` (default: document). */
  function init(root?: ParentNode): void;
}
