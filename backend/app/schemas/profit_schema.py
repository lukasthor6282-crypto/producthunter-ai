from pydantic import BaseModel, Field


class ProfitSimulationRequest(BaseModel):
    product_id: int | None = None
    average_price: float | None = Field(default=None, gt=0)
    estimated_cost: float | None = Field(default=None, gt=0)
    platform_fee_percent: float | None = Field(default=None, ge=0, le=0.4)
    estimated_shipping: float | None = Field(default=None, ge=0)
    packaging_cost: float | None = Field(default=None, ge=0)
    estimated_tax_percent: float | None = Field(default=None, ge=0, le=0.4)
    monthly_units: int = Field(default=40, ge=1, le=10000)
    ad_cost_per_unit: float = Field(default=0, ge=0, description="Custo opcional de trafego por unidade.")
    fixed_monthly_cost: float = Field(default=0, ge=0, description="Custo fixo mensal opcional.")


class ProfitSimulationResponse(BaseModel):
    product_id: int | None = None
    unit_revenue: float
    unit_cost: float
    unit_profit: float
    margin_percent: float
    monthly_profit: float
    breakeven_units: int
    platform_fee_value: float
    tax_value: float
    shipping_value: float
    packaging_value: float
    ad_cost_per_unit: float
    fixed_monthly_cost: float
    gross_monthly_profit: float
    net_monthly_profit: float
    roi_percent: float
    contribution_margin_percent: float
