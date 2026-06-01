from __future__ import annotations

from dataclasses import dataclass
from math import ceil

from app.schemas.product_schema import Product
from app.schemas.profit_schema import ProfitSimulationRequest, ProfitSimulationResponse


@dataclass(frozen=True)
class ProfitMetrics:
    unit_revenue: float
    unit_cost: float
    unit_profit: float
    margin_percent: float
    platform_fee_value: float
    tax_value: float
    shipping_value: float
    packaging_value: float
    contribution_margin_percent: float


def calculate_product_profit(product: Product, ad_cost_per_unit: float = 0) -> ProfitMetrics:
    """Calcula lucro por unidade com todas as deducoes variaveis principais.

    Margem bruta simples costuma enganar em marketplace. Por isso o MVP usa
    margem liquida estimada: preco - custo - taxa - frete - embalagem - imposto
    - trafego opcional. Essa formula ainda e simulada, mas deixa o raciocinio
    financeiro do produto mais proximo de uma operacao real.
    """
    platform_fee_value = product.average_price * product.platform_fee_percent
    tax_value = product.average_price * product.estimated_tax_percent
    unit_cost = (
        product.estimated_cost
        + platform_fee_value
        + product.estimated_shipping
        + product.packaging_cost
        + tax_value
        + ad_cost_per_unit
    )
    unit_profit = product.average_price - unit_cost
    margin_percent = (unit_profit / product.average_price) * 100
    contribution_base = product.average_price - platform_fee_value - tax_value - ad_cost_per_unit
    contribution_margin_percent = (unit_profit / max(contribution_base, 1)) * 100
    return ProfitMetrics(
        unit_revenue=round(product.average_price, 2),
        unit_cost=round(unit_cost, 2),
        unit_profit=round(unit_profit, 2),
        margin_percent=round(margin_percent, 2),
        platform_fee_value=round(platform_fee_value, 2),
        tax_value=round(tax_value, 2),
        shipping_value=round(product.estimated_shipping, 2),
        packaging_value=round(product.packaging_cost, 2),
        contribution_margin_percent=round(contribution_margin_percent, 2),
    )


def simulate_profit(
    request: ProfitSimulationRequest,
    product: Product | None = None,
) -> ProfitSimulationResponse:
    average_price = request.average_price or (product.average_price if product else 120)
    estimated_cost = request.estimated_cost or (product.estimated_cost if product else 62)
    platform_fee_percent = request.platform_fee_percent
    if platform_fee_percent is None:
        platform_fee_percent = product.platform_fee_percent if product else 0.13
    estimated_shipping = request.estimated_shipping
    if estimated_shipping is None:
        estimated_shipping = product.estimated_shipping if product else 14
    packaging_cost = request.packaging_cost
    if packaging_cost is None:
        packaging_cost = product.packaging_cost if product else 4
    estimated_tax_percent = request.estimated_tax_percent
    if estimated_tax_percent is None:
        estimated_tax_percent = product.estimated_tax_percent if product else 0.06

    platform_fee_value = average_price * platform_fee_percent
    tax_value = average_price * estimated_tax_percent
    unit_cost = (
        estimated_cost
        + platform_fee_value
        + estimated_shipping
        + packaging_cost
        + tax_value
        + request.ad_cost_per_unit
    )
    unit_profit = average_price - unit_cost
    margin_percent = (unit_profit / average_price) * 100
    gross_monthly_profit = unit_profit * request.monthly_units
    net_monthly_profit = gross_monthly_profit - request.fixed_monthly_cost
    contribution_base = average_price - platform_fee_value - tax_value - request.ad_cost_per_unit
    contribution_margin_percent = (unit_profit / max(contribution_base, 1)) * 100
    breakeven_units = max(1, ceil(request.fixed_monthly_cost / max(unit_profit, 1)))
    total_variable_investment = unit_cost * request.monthly_units
    roi_percent = (net_monthly_profit / max(total_variable_investment + request.fixed_monthly_cost, 1)) * 100

    return ProfitSimulationResponse(
        product_id=request.product_id or (product.id if product else None),
        unit_revenue=round(average_price, 2),
        unit_cost=round(unit_cost, 2),
        unit_profit=round(unit_profit, 2),
        margin_percent=round(margin_percent, 2),
        monthly_profit=round(net_monthly_profit, 2),
        breakeven_units=breakeven_units,
        platform_fee_value=round(platform_fee_value, 2),
        tax_value=round(tax_value, 2),
        shipping_value=round(estimated_shipping, 2),
        packaging_value=round(packaging_cost, 2),
        ad_cost_per_unit=round(request.ad_cost_per_unit, 2),
        fixed_monthly_cost=round(request.fixed_monthly_cost, 2),
        gross_monthly_profit=round(gross_monthly_profit, 2),
        net_monthly_profit=round(net_monthly_profit, 2),
        roi_percent=round(roi_percent, 2),
        contribution_margin_percent=round(contribution_margin_percent, 2),
    )
