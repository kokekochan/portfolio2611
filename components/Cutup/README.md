# Cutup

A heading whose letters look cut from different printed matter and pasted in a row: some plain, some on `frame` chips, one on signal, some mono lowercase, some outlined, each a little bigger or smaller and a few degrees off.

- **Provide:** `data-cutup` on one `h2.pb-h2`. `PB.init()` cuts it. The cut is fixed per word, so the same heading always looks the same. Screen readers read the plain word.
- **Do:** use it once per page, on a section heading of one to three words.
- **Don't:** combine it with `data-decode`, use it on the lead headline, on my name, or on anything longer than a heading.
