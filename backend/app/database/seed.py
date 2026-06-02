from __future__ import annotations

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider


def seed_preview() -> dict[str, int]:
    products = SimulatedMarketplaceProvider().list_products()
    return {"simulated_products": len(products)}


if __name__ == "__main__":
    print(seed_preview())

