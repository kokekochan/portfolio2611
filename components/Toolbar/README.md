# Toolbar

The top strip of a dossier page: a sticky bar in `frame` with a signal rule underneath, my name (Karaya) set huge in condensed bold, its feet cut off by the red rule at the bar's bottom edge, boxed section tabs and one signal action.

- **Provide:** `<header class="pb-toolbar">` with `a.pb-wordmark` (my display name), `nav.pb-tabs` of links (`aria-current="page"` on the active one), an optional `.pb-tally` (a real count) and one `.pb-btn--go`.
- **Do:** use it in place of `Masthead` on dossier-style pages. Give the tabs `data-decode="hover"`.
- **Don't:** add a second signal button, or put a logo or mark in place of the name.
- On phones the tabs wrap under the name and the bar stays sticky.
