import { AIAnalysisLoader } from '../components/animation/AIAnalysisLoader'
import { AIExplanationPanel } from '../components/recommendation/AIExplanationPanel'
import { RecommendationForm } from '../components/recommendation/RecommendationForm'
import type { UserProfile } from '../types/userProfile'

interface RecommendationProfileProps {
  loading: boolean
  narrative: string
  onSubmit: (profile: UserProfile) => void
}

export function RecommendationProfile({ loading, narrative, onSubmit }: RecommendationProfileProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <RecommendationForm onSubmit={onSubmit} disabled={loading} />
        {loading && <AIAnalysisLoader />}
      </div>
      <div className="xl:col-span-4">
        <AIExplanationPanel narrative={narrative} />
      </div>
    </div>
  )
}

