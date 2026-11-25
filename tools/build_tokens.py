"""Build tokens.css from tokens.json. Run: python tools/build_tokens.py
Never edit tokens.css by hand. Change tokens.json, then run this again."""
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
t = json.loads((root / "tokens.json").read_text(encoding="utf-8"))
def val(v):  # alias {text} -> var(--text)
    return re.sub(r"\{([a-z0-9-]+)\}", r"var(--\1)", v)
ink, paper = [], []
def add(name, value):
    if isinstance(value, dict):
        if "ink" in value: ink.append(f"  --{name}: {val(value['ink'])};")
        if "paper" in value: paper.append(f"  --{name}: {val(value['paper'])};")
    else:
        ink.append(f"  --{name}: {val(value)};")
for k in ("color", "shadow"):
    for x in t[k]["tokens"]: add(x["name"], x["value"])
flat = []
for k in ("spacing", "radius", "stroke", "tilt"):
    for x in t[k]["tokens"]: flat.append(f"  --{x['name']}: {x['value']};")
for fam, v in t["type"]["families"].items(): flat.append(f"  --font-{fam}: {v};")
out = ["/* Generated from tokens.json by tools/build_tokens.py. Do not edit by hand. */",
       ':root, [data-theme="ink"] {', *ink, "}",
       '[data-theme="paper"] {', *paper, "}",
       ":root {", *flat, "}"]
(root / "tokens.css").write_text("\n".join(out) + "\n", encoding="utf-8")
print("tokens.css written:", len(ink), "ink,", len(paper), "paper,", len(flat), "global")
