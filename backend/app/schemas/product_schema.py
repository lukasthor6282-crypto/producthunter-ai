from pydantic import BaseModel, ConfigDict, Field


class Product(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    marketplace: str
    marketplace_label: str
    niche: str
    niche_label: str
    category: str
    image_url: str | None = None
    product_url: str | None = None
    source: str = "simulated"
    source_product_id: str | None = None
    average_price: float = Field(gt=0)
    min_price: float = Field(gt=0)
    max_price: float = Field(gt=0)
    estimated_cost: float = Field(gt=0)
    platform_fee_percent: float = Field(ge=0, le=0.4)
    estimated_shipping: float = Field(ge=0)
    packaging_cost: float = Field(ge=0)
    estimated_tax_percent: float = Field(ge=0, le=0.4)
    affiliate_commission_percent: float = Field(ge=0, le=0.5)
    competitors_count: int = Field(ge=0)
    search_volume: int = Field(ge=0)
    trend_score: float = Field(ge=0, le=100)
    average_rating: float = Field(ge=0, le=5)
    reviews_count: int = Field(ge=0)
    sales_velocity: float = Field(ge=0, le=100)
    return_risk: float = Field(ge=0, le=100)
    seasonality: float = Field(ge=0, le=100)
    product_weight_kg: float = Field(gt=0)
    delivery_days: int = Field(ge=1)
    supplier_reliability: float = Field(ge=0, le=100)
    visual_appeal: float = Field(ge=0, le=100)
    kit_potential: float = Field(ge=0, le=100)
    recurrence_score: float = Field(ge=0, le=100)
    created_for_demo: bool = True


class ProductSearchParams(BaseModel):
    marketplace: str | None = None
    niche: str | None = None
    query: str | None = None
    limit: int = Field(default=30, ge=1, le=100)
