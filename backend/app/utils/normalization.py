from __future__ import annotations

import re
import unicodedata
from typing import Mapping


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value.strip().lower())
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "_", ascii_value).strip("_")


def normalize_alias(value: str, aliases: Mapping[str, str]) -> str:
    if not value:
        return value
    lowered = value.strip().lower()
    return aliases.get(lowered) or aliases.get(slugify(value).replace("_", " ")) or slugify(value)


def clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return max(minimum, min(maximum, value))


def normalize_range(value: float, minimum: float, maximum: float) -> float:
    if maximum == minimum:
        return 0.0
    return clamp((value - minimum) / (maximum - minimum), 0.0, 1.0)
