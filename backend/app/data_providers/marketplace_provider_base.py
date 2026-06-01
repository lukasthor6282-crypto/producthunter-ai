from abc import ABC, abstractmethod

from app.schemas.product_schema import Product


class MarketplaceProviderBase(ABC):
    @abstractmethod
    def list_products(self) -> list[Product]:
        raise NotImplementedError

    @abstractmethod
    def get_product(self, product_id: int) -> Product | None:
        raise NotImplementedError
