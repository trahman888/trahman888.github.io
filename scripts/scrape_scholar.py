#!/usr/bin/env python3
"""
Fetch Google Scholar metrics for Tanzila Rahman and regenerate
public/data/scholar.json.

Local usage:
    pip install scholarly fake-useragent
    python scripts/scrape_scholar.py

In CI: see .github/workflows/update-scholar.yml.

NOTE: Google Scholar aggressively rate-limits cloud IPs. If the scrape
fails (captcha / 429 / network), this script logs a warning and exits 0
WITHOUT modifying scholar.ts, so the workflow does not fail noisily and
the previously-committed values are preserved.
"""
from __future__ import annotations

import datetime
import json
import sys
import time
import traceback
from pathlib import Path

AUTHOR_ID = "7GKKBLkAAAAJ"
REPO_ROOT = Path(__file__).resolve().parents[1]
OUT_FILE = REPO_ROOT / "public" / "data" / "scholar.json"


def _try_fetch():
    """Try to fetch the author profile. Raises on failure."""
    try:
        from scholarly import scholarly, ProxyGenerator  # type: ignore[import-not-found]
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "Missing optional dependency 'scholarly'. Install with: pip install scholarly fake-useragent"
        ) from exc

    # Attempt 1: direct request
    try:
        author = scholarly.search_author_id(AUTHOR_ID)
        return scholarly.fill(author, sections=["indices", "counts"])
    except Exception as e:
        print(f"[warn] direct fetch failed: {e}", file=sys.stderr)

    # Attempt 2: free proxies (often unreliable but worth one shot)
    pg = ProxyGenerator()
    if pg.FreeProxies():
        scholarly.use_proxy(pg)
        time.sleep(2)
        author = scholarly.search_author_id(AUTHOR_ID)
        return scholarly.fill(author, sections=["indices", "counts"])

    raise RuntimeError("All fetch strategies failed")


def _build_json(author) -> str:
    today = datetime.date.today()
    # Google Scholar's "since {year}" window is the last 5 calendar years
    # (current year inclusive), so "since" year = current_year - 4.
    since_year = today.year - 4

    per_year_raw = author.get("cites_per_year", {}) or {}
    per_year = sorted(
        [{"year": int(y), "count": int(c)} for y, c in per_year_raw.items()],
        key=lambda d: d["year"],
    )

    data = {
        "profileUrl": f"https://scholar.google.com/citations?user={AUTHOR_ID}&hl=en",
        "lastUpdate": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "totals": {
            "citations": int(author.get("citedby", 0)),
            "citationsSince": {"year": since_year, "value": int(author.get("citedby5y", 0))},
            "hIndex": int(author.get("hindex", 0)),
            "hIndexSince": {"year": since_year, "value": int(author.get("hindex5y", 0))},
            "i10Index": int(author.get("i10index", 0)),
            "i10IndexSince": {"year": since_year, "value": int(author.get("i10index5y", 0))},
        },
        "perYear": per_year,
    }

    return json.dumps(data, indent=2) + "\n"


def _totals_changed(existing_data: dict | None, new_totals: dict) -> bool:
    if not existing_data:
        return True

    existing_totals = existing_data.get("totals") or {}
    for key in ("citations", "hIndex", "i10Index"):
        if existing_totals.get(key) != new_totals.get(key):
            return True
    return False


def main() -> int:
    try:
        author = _try_fetch()
    except Exception:
        print("[warn] Scholar fetch failed — keeping existing data.", file=sys.stderr)
        traceback.print_exc()
        return 0  # soft fail

    if not author or not author.get("citedby"):
        print("[warn] Empty result — keeping existing data.", file=sys.stderr)
        return 0

    js = _build_json(author)
    new_data = json.loads(js)
    existing_data = None

    if OUT_FILE.exists():
        try:
            existing_data = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing_data = None

    if not _totals_changed(existing_data, new_data.get("totals", {})):
        print("No change in Scholar totals (citations, hIndex, i10Index).")
        return 0

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(js, encoding="utf-8")
    print(
        f"Updated {OUT_FILE.relative_to(REPO_ROOT)} — "
        f"{author.get('citedby')} citations, "
        f"h-index={author.get('hindex')}, "
        f"i10={author.get('i10index')}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
