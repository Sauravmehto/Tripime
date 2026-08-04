#!/usr/bin/env python3
"""Render pre-build check: require Python 3.11.x before pip install."""

from __future__ import annotations

import subprocess
import sys


def main() -> int:
    print(f"==> Python: {sys.version.split()[0]} ({sys.executable})")
    if sys.version_info[:2] != (3, 11):
        print(
            f"ERROR: Render must use Python 3.11.x (got {sys.version.split()[0]}).\n"
            "In Render Dashboard → Environment, set:\n"
            "  PYTHON_VERSION=3.11.9\n"
            "Then: Manual Deploy → Clear build cache & deploy.",
            file=sys.stderr,
        )
        return 1

    print("OK: Python 3.11 detected")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("==> Build complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
