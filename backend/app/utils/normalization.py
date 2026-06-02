from __future__ import annotations

import math
import re
import unicodedata


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def normalize_range(value: float, low: float, high: float) -> float:
    if high == low:
        return 0.0
    return clamp((value - low) / (high - low), 0.0, 1.0)


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    if denominator == 0:
        return default
    return numerator / denominator


def log_scale(value: float, base: float = 10.0) -> float:
    return math.log(max(value, 1), base)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", normalized.lower()).strip("-")
    return normalized or "item"


def soft_round(value: float, places: int = 2) -> float:
    return round(float(value), places)

