import { SearchCheck } from 'lucide-react'
import { useState } from 'react'
import { defaultProfile, type UserProfile } from '../../types/userProfile'
import { GlassPanel } from '../ui/GlassPanel'
import { GlowButton } from '../ui/GlowButton'

interface RecommendationFormProps {
  onSubmit: (profile: UserProfile) => void
  disabled?: boolean
}

const fields = {
  operation_type: ['Afiliado', 'Vendedor', 'Dropshipping', 'Revendedor', 'Loja propria'],
  marketplace: ['Mercado Livre', 'Amazon', 'Shopee', 'AliExpress', 'TikTok Shop', 'Magalu', 'Shein'],
  niche: ['Tecnologia', 'Beleza', 'Casa', 'Brinquedos', 'Pets', 'Moda', 'Ferramentas', 'Automotivo', 'Decoracao', 'Saude', 'Esportes', 'Games', 'Papelaria', 'Cozinha', 'Organizacao'],
  goal: ['Maior lucro', 'Giro rapido', 'Baixa concorrencia', 'Alta conversao', 'Produto viral', 'Ticket alto', 'Comissao alta', 'Produto para iniciante', 'Baixo risco', 'Produto para trafego pago', 'Produto para conteudo organico'],
  investment_range: ['Sem estoque', 'Ate R$ 500', 'R$ 500 a R$ 2.000', 'R$ 2.000 a R$ 5.000', 'Acima de R$ 5.000'],
  experience_level: ['Iniciante', 'Intermediario', 'Avancado'],
  traffic_type: ['Marketplace', 'Organico', 'Pago', 'Redes sociais', 'Indefinido'],
}

const labels: Record<keyof UserProfile, string> = {
  operation_type: 'Eu sou',
  marketplace: 'Plataforma',
  niche: 'Nicho',
  goal: 'Objetivo',
  investment_range: 'Investimento',
  experience_level: 'Nivel',
  traffic_type: 'Tipo de trafego',
}

export function RecommendationForm({ onSubmit, disabled }: RecommendationFormProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  return (
    <GlassPanel>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-mint/15 p-3 text-mint"><SearchCheck size={23} /></span>
        <div>
          <h2 className="text-xl font-bold text-white">Perfil de Recomendacao</h2>
          <p className="text-sm text-mist">Informe onde vende, seu nicho e seu objetivo principal.</p>
        </div>
      </div>
      <form
        className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(profile)
        }}
      >
        {(Object.keys(fields) as Array<keyof UserProfile>).map((key) => (
          <label key={key} className="text-xs font-medium text-mist">
            {labels[key]}
            <select
              className="mt-2 w-full rounded-lg border border-line bg-ink/80 px-3 py-3 text-sm text-white outline-none transition focus:border-mint"
              value={profile[key]}
              onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
            >
              {fields[key].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        ))}
        <div className="flex items-end">
          <GlowButton type="submit" disabled={disabled} className="w-full">
            Encontrar produtos
          </GlowButton>
        </div>
      </form>
    </GlassPanel>
  )
}

