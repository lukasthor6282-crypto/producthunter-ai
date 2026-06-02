export interface UserProfile {
  operation_type: string
  marketplace: string
  niche: string
  goal: string
  investment_range: string
  experience_level: string
  traffic_type: string
}

export const defaultProfile: UserProfile = {
  operation_type: 'Vendedor',
  marketplace: 'Shopee',
  niche: 'Tecnologia',
  goal: 'Maior lucro',
  investment_range: 'R$ 500 a R$ 2.000',
  experience_level: 'Iniciante',
  traffic_type: 'Marketplace',
}

