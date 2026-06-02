from __future__ import annotations

import math

from app.schemas.profit_schema import ProfitSimulationRequest, ProfitSimulationResponse
from app.utils.normalization import safe_divide, soft_round


def simulate_profit(payload: ProfitSimulationRequest) -> ProfitSimulationResponse:
    fee = payload.selling_price * payload.marketplace_fee_percent
    tax = payload.selling_price * payload.tax_percent
    commission = payload.selling_price * payload.affiliate_commission_percent
    total_cost = payload.product_cost + fee + payload.shipping_cost + payload.packaging_cost + tax + commission
    profit = payload.selling_price - total_cost
    net_margin = safe_divide(profit, payload.selling_price)
    monthly_profit = profit * payload.expected_monthly_sales - payload.monthly_fixed_cost
    break_even_units = 0
    if payload.monthly_fixed_cost > 0:
        break_even_units = math.ceil(payload.monthly_fixed_cost / max(profit, 0.01))

    if profit <= 0:
        recommendation = "Nao vale a pena no preco atual: o custo total supera a receita por unidade."
    elif net_margin < 0.15:
        recommendation = "Margem apertada. Negocie custo, aumente preco ou reduza frete antes de escalar."
    elif net_margin < 0.28:
        recommendation = "Operacao viavel para teste controlado, com atencao a devolucoes e taxa de anuncio."
    else:
        recommendation = "Boa margem para validar demanda e escalar com acompanhamento de conversao."

    return ProfitSimulationResponse(
        revenue_per_unit=soft_round(payload.selling_price),
        total_cost_per_unit=soft_round(total_cost),
        profit_per_unit=soft_round(profit),
        net_margin=soft_round(net_margin, 4),
        monthly_profit_estimate=soft_round(monthly_profit),
        break_even_units=break_even_units,
        recommendation=recommendation,
    )

