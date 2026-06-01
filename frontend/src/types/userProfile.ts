export type UserProfile = {
  operation_type: string;
  marketplace: string;
  niche: string;
  goal: string;
  investment_range: string;
  experience_level: string;
  traffic_type: string;
};

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

export const defaultProfile: UserProfile = {
  operation_type: "seller",
  marketplace: "shopee",
  niche: "technology",
  goal: "margin_and_conversion",
  investment_range: "500_to_2000",
  experience_level: "beginner",
  traffic_type: "marketplace",
};

export const profileLabels: Record<keyof UserProfile, string> = {
  operation_type: "Eu sou",
  marketplace: "Marketplace",
  niche: "Nicho",
  goal: "Objetivo",
  investment_range: "Investimento",
  experience_level: "Experiência",
  traffic_type: "Tráfego",
};

export const profileOptions = {
  operation_type: [
    { value: "seller", label: "Vendedor", description: "Operação própria em marketplace." },
    { value: "affiliate", label: "Afiliado", description: "Comissão e conversão em primeiro plano." },
    { value: "dropshipping", label: "Dropshipping", description: "Prazo, peso e fornecedor importam mais." },
    { value: "reseller", label: "Revendedor", description: "Compra e revenda com controle de margem." },
    { value: "own_store", label: "Loja própria", description: "Produto, marca e recorrência no centro." },
  ],
  marketplace: [
    { value: "mercado_livre", label: "Mercado Livre" },
    { value: "amazon", label: "Amazon" },
    { value: "shopee", label: "Shopee" },
    { value: "aliexpress", label: "AliExpress" },
    { value: "tiktok_shop", label: "TikTok Shop" },
    { value: "magalu", label: "Magalu" },
    { value: "shein", label: "Shein" },
  ],
  niche: [
    { value: "technology", label: "Tecnologia" },
    { value: "beauty", label: "Beleza" },
    { value: "home", label: "Casa" },
    { value: "toys", label: "Brinquedos" },
    { value: "pets", label: "Pets" },
    { value: "fashion", label: "Moda" },
    { value: "tools", label: "Ferramentas" },
    { value: "automotive", label: "Automotivo" },
    { value: "decoration", label: "Decoração" },
    { value: "health", label: "Saúde" },
    { value: "sports", label: "Esportes" },
    { value: "games", label: "Games" },
    { value: "stationery", label: "Papelaria" },
    { value: "kitchen", label: "Cozinha" },
    { value: "organization", label: "Organização" },
  ],
  goal: [
    { value: "margin_and_conversion", label: "Boa margem e alta conversão" },
    { value: "highest_profit", label: "Maior lucro" },
    { value: "fast_turnover", label: "Giro rápido" },
    { value: "low_competition", label: "Baixa concorrência" },
    { value: "high_conversion", label: "Alta conversão" },
    { value: "viral_product", label: "Produto viral" },
    { value: "high_ticket", label: "Ticket alto" },
    { value: "high_commission", label: "Comissão alta" },
    { value: "beginner_product", label: "Produto para iniciante" },
    { value: "low_risk", label: "Baixo risco" },
  ],
  investment_range: [
    { value: "up_to_500", label: "Até R$ 500" },
    { value: "500_to_2000", label: "R$ 500 a R$ 2.000" },
    { value: "2000_to_5000", label: "R$ 2.000 a R$ 5.000" },
    { value: "5000_plus", label: "Acima de R$ 5.000" },
  ],
  experience_level: [
    { value: "beginner", label: "Iniciante" },
    { value: "intermediate", label: "Intermediário" },
    { value: "advanced", label: "Avançado" },
  ],
  traffic_type: [
    { value: "marketplace", label: "Marketplace" },
    { value: "paid_ads", label: "Tráfego pago" },
    { value: "organic", label: "Orgânico" },
    { value: "social", label: "Redes sociais" },
    { value: "influencer", label: "Influenciador" },
  ],
} satisfies Record<keyof UserProfile, SelectOption[]>;

export function profileOptionLabel(field: keyof UserProfile, value: string) {
  return profileOptions[field].find((option) => option.value === value)?.label ?? value;
}
