from __future__ import annotations

from pydantic import BaseModel, Field


class ProfitSimulationRequest(BaseModel):
    selling_price: float = Field(gt=0)
    product_cost: float = Field(ge=0)
    marketplace_fee_percent: float = Field(default=0.14, ge=0, le=0.8)
    shipping_cost: float = Field(default=0, ge=0)
    packaging_cost: float = Field(default=1.9, ge=0)
    tax_percent: float = Field(default=0.06, ge=0, le=0.6)
    affiliate_commission_percent: float = Field(default=0, ge=0, le=0.8)
    expected_monthly_sales: int = Field(default=50, ge=0)
    monthly_fixed_cost: float = Field(default=0, ge=0)


class ProfitSimulationResponse(BaseModel):
    revenue_per_unit: float
    total_cost_per_unit: float
    profit_per_unit: float
    net_margin: float
    monthly_profit_estimate: float
    break_even_units: int
    recommendation: str

