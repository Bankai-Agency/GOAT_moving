#!/usr/bin/env python3
"""Inventory of a GTM container export (Admin -> Export Container).

Usage:
    /usr/bin/python3 scripts/gtm-inventory.py ~/Downloads/GTM-W5VQHNGV_v42.json

Prints every tag, trigger and variable with the names the UI shows, who
references whom, the variables nothing references, the triggers no tag uses,
and the items docs/GTM-CLEANUP.md tells us to touch. Read-only: the export is
never modified.
"""

import json
import re
import sys
from collections import defaultdict

# Trigger ids GTM reserves for the built-in page triggers.
BUILTIN_TRIGGERS = {
    "2147479553": "All Pages",
    "2147479572": "Consent Initialization - All Pages",
    "2147479573": "Initialization - All Pages",
}

TAG_TYPES = {
    "html": "Custom HTML",
    "img": "Custom Image",
    "googtag": "Google Tag",
    "gaawc": "GA4 Configuration",
    "gaawe": "GA4 Event",
    "awct": "Ads Conversion",
    "sp": "Ads Remarketing",
    "gclidw": "Conversion Linker",
    "gaawu": "Ads User-Provided Data",
    "ua": "Universal Analytics",
}

VARIABLE_TYPES = {
    "v": "Data Layer Variable",
    "j": "JavaScript Variable",
    "jsm": "Custom JavaScript",
    "c": "Constant",
    "u": "URL",
    "aev": "Auto-Event Variable",
    "r": "Random Number",
    "ctid": "Container ID",
    "e": "Event",
    "f": "HTTP Referrer",
    "k": "1st Party Cookie",
    "d": "DOM Element",
    "smm": "Lookup Table",
    "remm": "RegEx Table",
    "gas": "Google Analytics Settings",
    "awec": "User-Provided Data",
    "vis": "Element Visibility",
    "dbg": "Debug Mode",
    "cid": "Container ID",
    "uv": "Undefined Value",
}

# What docs/GTM-CLEANUP.md asks us to find, as substrings of a tag's code/URL.
TAG_FLAGS = [
    ("api.ipify.org", "3.1 sync getIP request: delete (or make async + Window Loaded)"),
    ("script.google.com/macros/s/", "3.2 Apps Script web hook: keep one lead hook"),
    ("sbjs.init", "3.5/3.6 sourcebuster: trigger Window Loaded or delete"),
    ('addEventListener("input"', "3.5 form tracking: trigger Window Loaded"),
    ("addEventListener('input'", "3.5 form tracking: trigger Window Loaded"),
    ("beforeunload", "3.5 abandoned form tracking: trigger Window Loaded"),
    ("sessionStorage", "3.4.6 lead_name in sessionStorage: delete after DL variables"),
]

VARIABLE_FLAGS = [
    ("#modal-fullName", "3.4.7 old form field: delete with the Continue trigger"),
    ("#modal-phone", "3.4.7 old form field: delete with the Continue trigger"),
    ("#modal-email", "3.3 old form field: delete"),
    ("userIP", "3.1 goes away with the getIP tag"),
    ("giGdCIj-2LEZEN3_0JAB", "3.3 Ads label constant: delete if the tag uses the label directly"),
]

REF_RE = re.compile(r"\{\{([^}]+)\}\}")


def walk_strings(node):
    """Yield every string inside a parameter tree (value, list, map)."""
    if node is None:
        return
    if isinstance(node, str):
        yield node
    elif isinstance(node, list):
        for item in node:
            yield from walk_strings(item)
    elif isinstance(node, dict):
        for key in ("value", "list", "map", "parameter"):
            if key in node:
                yield from walk_strings(node[key])


def referenced_variables(entity):
    """Names of {{variables}} used anywhere inside an entity's parameters/filters."""
    names = set()
    for key in ("parameter", "filter", "customEventFilter", "autoEventFilter"):
        for text in walk_strings(entity.get(key)):
            names.update(m.strip() for m in REF_RE.findall(text))
    return names


def param(entity, key):
    for p in entity.get("parameter", []):
        if p.get("key") == key:
            return p.get("value")
    return None


def one_line(text, limit=110):
    text = re.sub(r"\s+", " ", text or "").strip()
    return text if len(text) <= limit else text[: limit - 3] + "..."


def describe_tag(tag):
    ttype = tag.get("type", "")
    if ttype == "html":
        return one_line(param(tag, "html"))
    if ttype == "img":
        return one_line(param(tag, "url"))
    if ttype in ("googtag", "gaawc"):
        return "id " + str(param(tag, "tagId") or param(tag, "measurementId") or "")
    if ttype == "gaawe":
        return "event " + str(param(tag, "eventName") or "")
    if ttype == "awct":
        return "conversion " + str(param(tag, "conversionId")) + " / " + str(param(tag, "conversionLabel"))
    if ttype == "gaawu":
        return "user data " + str(param(tag, "userDataVariable") or param(tag, "conversionId") or "")
    values = [one_line(v, 60) for v in walk_strings(tag.get("parameter")) if v]
    return "; ".join(values[:3])


def describe_trigger(trigger):
    parts = []
    for key in ("customEventFilter", "filter", "autoEventFilter"):
        for cond in trigger.get(key, []):
            args = {p.get("key"): p.get("value") for p in cond.get("parameter", [])}
            negate = " NOT" if args.get("negate") == "true" else ""
            parts.append(
                f"{args.get('arg0', '?')}{negate} {cond.get('type', '?').lower()} {args.get('arg1', '?')}"
            )
    return " AND ".join(parts) if parts else "(no conditions)"


def describe_variable(variable):
    vtype = variable.get("type", "")
    if vtype == "v":
        return "dataLayer " + str(param(variable, "name"))
    if vtype == "j":
        return "window." + str(param(variable, "name"))
    if vtype == "jsm":
        return one_line(param(variable, "javascript"))
    if vtype == "c":
        return "= " + str(param(variable, "value"))
    if vtype == "aev":
        return "auto-event " + str(param(variable, "varType"))
    if vtype == "u":
        return "url " + str(param(variable, "component"))
    values = [one_line(v, 60) for v in walk_strings(variable.get("parameter")) if v]
    return "; ".join(values[:3])


def flags_for(text, table):
    hits = []
    for needle, note in table:
        if needle in text:
            hits.append(note)
    return hits


def main(path):
    with open(path, encoding="utf-8") as f:
        export = json.load(f)
    cv = export["containerVersion"]
    tags = cv.get("tag", [])
    triggers = cv.get("trigger", [])
    variables = cv.get("variable", [])
    builtins = cv.get("builtInVariable", [])

    trigger_name = dict(BUILTIN_TRIGGERS)
    trigger_name.update({t["triggerId"]: t["name"] for t in triggers})

    # Reference graph: variable name -> set of "kind:name" that mention it.
    var_refs = defaultdict(set)
    trigger_users = defaultdict(set)
    for tag in tags:
        for name in referenced_variables(tag):
            var_refs[name].add("tag:" + tag["name"])
        for tid in tag.get("firingTriggerId", []) + tag.get("blockingTriggerId", []):
            trigger_users[tid].add(tag["name"])
    for trigger in triggers:
        for name in referenced_variables(trigger):
            var_refs[name].add("trigger:" + trigger["name"])
    for variable in variables:
        for name in referenced_variables(variable):
            var_refs[name].add("variable:" + variable["name"])

    print(f"Container {cv.get('container', {}).get('publicId', '?')}"
          f"  version {cv.get('containerVersionId', '?')} \"{cv.get('name', '')}\"")
    print(f"{len(tags)} tags, {len(triggers)} triggers, {len(variables)} user variables,"
          f" {len(builtins)} built-in variables\n")

    print("=" * 78)
    print("TAGS")
    print("=" * 78)
    for tag in sorted(tags, key=lambda t: int(t["tagId"])):
        firing = [trigger_name.get(i, i) for i in tag.get("firingTriggerId", [])]
        blocking = [trigger_name.get(i, i) for i in tag.get("blockingTriggerId", [])]
        paused = "  [PAUSED]" if tag.get("paused") else ""
        print(f"\n[{tag['tagId']}] {tag['name']}  ({TAG_TYPES.get(tag['type'], tag['type'])}){paused}")
        print(f"    fires on: {', '.join(firing) or '(none)'}")
        if blocking:
            print(f"    blocked by: {', '.join(blocking)}")
        print(f"    content: {describe_tag(tag)}")
        used = sorted(referenced_variables(tag))
        if used:
            print(f"    uses: {', '.join(used)}")
        code = " ".join(walk_strings(tag.get("parameter")))
        for note in flags_for(code, TAG_FLAGS):
            print(f"    >> {note}")
        if "Continue" in " ".join(firing):
            print("    >> 3.4 fires on the dead Continue trigger: move to Lead - generate_lead")

    print("\n" + "=" * 78)
    print("TRIGGERS")
    print("=" * 78)
    for trigger in sorted(triggers, key=lambda t: int(t["triggerId"])):
        users = sorted(trigger_users.get(trigger["triggerId"], []))
        print(f"\n[{trigger['triggerId']}] {trigger['name']}  ({trigger.get('type', '?')})")
        print(f"    when: {describe_trigger(trigger)}")
        print(f"    used by: {', '.join(users) or '(NO TAG - candidate for deletion)'}")
        cond_text = describe_trigger(trigger)
        if "Continue" in cond_text:
            print("    >> 3.4.7 dead Continue trigger: delete after retargeting its tags")

    print("\n" + "=" * 78)
    print("VARIABLES")
    print("=" * 78)
    unreferenced = []
    for variable in sorted(variables, key=lambda v: int(v["variableId"])):
        refs = sorted(var_refs.get(variable["name"], []))
        print(f"\n[{variable['variableId']}] {variable['name']}  ({VARIABLE_TYPES.get(variable['type'], variable['type'])})")
        print(f"    content: {describe_variable(variable)}")
        print(f"    referenced by: {', '.join(refs) or '(NOTHING)'}")
        if not refs:
            unreferenced.append(variable["name"])
        text = variable["name"] + " " + " ".join(walk_strings(variable.get("parameter")))
        for note in flags_for(text, VARIABLE_FLAGS):
            print(f"    >> {note}")

    print("\n" + "=" * 78)
    print("SUMMARY")
    print("=" * 78)
    print(f"\nUnreferenced user variables ({len(unreferenced)}), plan 3.3:")
    for name in unreferenced:
        print(f"  - {name}")
    unused_triggers = [t["name"] for t in triggers if not trigger_users.get(t["triggerId"])]
    print(f"\nTriggers no tag uses ({len(unused_triggers)}):")
    for name in unused_triggers:
        print(f"  - {name}")
    builtin_names = sorted(b.get("name", b.get("type", "?")) for b in builtins)
    print(f"\nBuilt-in variables enabled ({len(builtin_names)}): {', '.join(builtin_names)}")
    missing = sorted(n for n in var_refs
                     if n not in {v["name"] for v in variables} and n not in builtin_names and n != "_event")
    if missing:
        print(f"\nReferenced but not defined (typos or disabled built-ins): {', '.join(missing)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
