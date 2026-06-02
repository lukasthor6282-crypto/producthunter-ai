from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from app.data_providers.marketplace_provider_base import MarketplaceProviderBase


class CSVMarketplaceProvider(MarketplaceProviderBase):
    """Provider prepared for future imports from affiliate reports or exports."""

    def __init__(self, csv_path: str | Path) -> None:
        self.csv_path = Path(csv_path)

    def list_products(self) -> list[dict[str, Any]]:
        if not self.csv_path.exists():
            return []
        dataframe = pd.read_csv(self.csv_path)
        return dataframe.to_dict(orient="records")

