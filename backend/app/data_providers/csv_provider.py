from pathlib import Path

import pandas as pd

from app.schemas.product_schema import Product


class CSVProductProvider:
    def __init__(self, csv_path: str | Path) -> None:
        self.csv_path = Path(csv_path)

    def list_products(self) -> list[Product]:
        frame = pd.read_csv(self.csv_path)
        return [Product(**row) for row in frame.to_dict(orient="records")]

    def get_product(self, product_id: int) -> Product | None:
        return next((product for product in self.list_products() if product.id == product_id), None)
