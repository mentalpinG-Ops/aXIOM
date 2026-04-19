#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_translations.py — aXIOM translation status checker

Compares language JSON files against the English master (en.json) and
reports per-string translation status.

Usage:
    python tools/check_translations.py [--lang LANG] [--verbose]

Options:
    --lang LANG   Check a specific language code only (e.g. pl, de).
                  Defaults to all available language files.
    --verbose     Show all strings including fully translated ones.
    --strict      Exit with code 1 if any strings are missing or untranslated.

String groups are inferred from the key prefix (e.g. "modal.", "status.").
"""

import argparse
import json
import os
import sys

# ── Configuration ────────────────────────────────────────────────────────────

# Path to the i18n directory relative to the repository root
I18N_DIR = os.path.join(os.path.dirname(__file__), "..", "legacy", "i18n")

# Master language file (source of truth)
MASTER_LANG = "en"

# Languages expected to ship with each version
SHIPPING_V1_0 = {"en", "pl"}
SHIPPING_V1_1 = {"de"}

# Status symbols
STATUS_DONE    = "✅"
STATUS_MISSING = "⬜"
STATUS_EMPTY   = "✏️"

# ── Helpers ──────────────────────────────────────────────────────────────────

def load_json(path: str) -> dict:
    """Load a JSON file with UTF-8 encoding. Returns empty dict on failure."""
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as exc:
        print(f"  ERROR: could not parse {path}: {exc}", file=sys.stderr)
        sys.exit(1)


def key_group(key: str) -> str:
    """Return the string group prefix from a dotted key."""
    return key.split(".")[0]


def discover_languages(i18n_dir: str) -> list[str]:
    """Return sorted list of language codes found in the i18n directory."""
    codes = []
    try:
        for fname in os.listdir(i18n_dir):
            if fname.endswith(".json"):
                code = fname[:-5]
                if code != MASTER_LANG:
                    codes.append(code)
    except FileNotFoundError:
        pass
    return sorted(codes)


def string_status(key: str, master: dict, target: dict) -> str:
    """
    Return STATUS_DONE, STATUS_EMPTY, or STATUS_MISSING for a given key.

    - STATUS_DONE    — key present in target and value is non-empty
    - STATUS_EMPTY   — key present in target but value is empty string
    - STATUS_MISSING — key absent from target
    """
    if key not in target:
        return STATUS_MISSING
    value = target[key]
    if isinstance(value, str) and value.strip() == "":
        return STATUS_EMPTY
    return STATUS_DONE


# ── Report ───────────────────────────────────────────────────────────────────

def check_language(lang: str, master: dict, verbose: bool) -> dict:
    """
    Check a single language file against the master.

    Returns a summary dict:
        {
            "lang": str,
            "total": int,
            "done": int,
            "empty": int,
            "missing": int,
            "file_found": bool,
        }
    """
    lang_path = os.path.join(I18N_DIR, f"{lang}.json")
    file_found = os.path.exists(lang_path)
    target = load_json(lang_path)

    version_note = ""
    if lang in SHIPPING_V1_0:
        version_note = " (ships with v1.0)"
    elif lang in SHIPPING_V1_1:
        version_note = " (ships with v1.1)"

    print(f"\n{'─' * 60}")
    print(f"  Language: {lang}{version_note}")
    if not file_found:
        print(f"  File:     {lang_path} — NOT FOUND")
    else:
        print(f"  File:     {lang_path}")
    print(f"{'─' * 60}")

    summary = {
        "lang": lang,
        "total": len(master),
        "done": 0,
        "empty": 0,
        "missing": 0,
        "file_found": file_found,
    }

    # Group keys by prefix for grouped output
    groups: dict[str, list] = {}
    for key in sorted(master):
        group = key_group(key)
        groups.setdefault(group, []).append(key)

    for group, keys in sorted(groups.items()):
        group_done = group_empty = group_missing = 0
        rows = []
        for key in keys:
            status = string_status(key, master, target)
            if status == STATUS_DONE:
                summary["done"] += 1
                group_done += 1
            elif status == STATUS_EMPTY:
                summary["empty"] += 1
                group_empty += 1
                rows.append((key, status))
            else:
                summary["missing"] += 1
                group_missing += 1
                rows.append((key, status))
            if verbose and status == STATUS_DONE:
                rows.append((key, status))

        total_in_group = len(keys)
        group_status = (
            STATUS_DONE if group_done == total_in_group
            else STATUS_MISSING if group_done == 0 and group_empty == 0
            else STATUS_EMPTY
        )

        print(
            f"\n  {group_status} [{group}]  "
            f"{group_done}/{total_in_group} strings translated"
        )
        if rows:
            for key, status in rows:
                print(f"       {status}  {key}")

    # Summary line
    pct = int(100 * summary["done"] / summary["total"]) if summary["total"] else 0
    print(f"\n  Summary: {summary['done']}/{summary['total']} strings translated "
          f"({pct}%)  |  "
          f"{STATUS_EMPTY} empty: {summary['empty']}  "
          f"{STATUS_MISSING} missing: {summary['missing']}")

    return summary


def main():
    parser = argparse.ArgumentParser(
        description="aXIOM translation status checker"
    )
    parser.add_argument(
        "--lang", metavar="LANG",
        help="check a specific language only (e.g. pl, de)"
    )
    parser.add_argument(
        "--verbose", action="store_true",
        help="show all strings including fully translated ones"
    )
    parser.add_argument(
        "--strict", action="store_true",
        help="exit with code 1 if any strings are missing or untranslated"
    )
    args = parser.parse_args()

    master_path = os.path.join(I18N_DIR, f"{MASTER_LANG}.json")
    master = load_json(master_path)
    if not master:
        print(f"ERROR: master language file not found or empty: {master_path}",
              file=sys.stderr)
        sys.exit(1)

    print(f"aXIOM — Translation Status Report")
    print(f"Master: {master_path}  ({len(master)} strings)\n")

    if args.lang:
        languages = [args.lang]
    else:
        languages = discover_languages(I18N_DIR)

    if not languages:
        print("No target language files found. Add pl.json or de.json to", I18N_DIR)
        sys.exit(0)

    all_summaries = []
    for lang in languages:
        summary = check_language(lang, master, verbose=args.verbose)
        all_summaries.append(summary)

    # Overall table
    print(f"\n\n{'═' * 60}")
    print("  Overall Translation Status")
    print(f"{'═' * 60}")
    print(f"  {'Language':<10} {'File':<8} {'Done':>6} {'Empty':>6} {'Missing':>8} {'%':>5}")
    print(f"  {'─'*10} {'─'*8} {'─'*6} {'─'*6} {'─'*8} {'─'*5}")
    problems = False
    for s in all_summaries:
        pct = int(100 * s["done"] / s["total"]) if s["total"] else 0
        found = "✓" if s["file_found"] else "✗"
        flag = "" if s["missing"] == 0 and s["empty"] == 0 else " ←"
        if flag:
            problems = True
        print(
            f"  {s['lang']:<10} {found:<8} {s['done']:>6} {s['empty']:>6} "
            f"{s['missing']:>8} {pct:>4}%{flag}"
        )
    print()

    if args.strict and problems:
        print("Strict mode: untranslated strings found — exiting with code 1.",
              file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
