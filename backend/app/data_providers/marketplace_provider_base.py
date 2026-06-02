from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class MarketplaceProviderBase(ABC):
    """Interface for simulated, CSV, database, or official API providers."""

    @abstractmethod
    def list_products(self) -> list[dict[str, Any]]:
        """Return raw marketplace product rows."""

