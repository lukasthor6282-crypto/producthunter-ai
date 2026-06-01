import { RecommendationResults as RecommendationResultsView } from "../components/recommendation/RecommendationResults";
import type { PageKey } from "../components/layout/Sidebar";
import type { RecommendationItem, RecommendationResponse } from "../types/recommendation";

type RecommendationResultsProps = {
  data: RecommendationResponse | null;
  selectedItem?: RecommendationItem;
  onSelect: (item: RecommendationItem) => void;
  onNavigate: (page: PageKey) => void;
};

export function RecommendationResults({ data, selectedItem, onSelect, onNavigate }: RecommendationResultsProps) {
  return (
    <div className="min-h-screen py-8">
      <RecommendationResultsView
        data={data}
        selectedItem={selectedItem}
        onSelect={onSelect}
        onEditProfile={() => onNavigate("profile")}
        onOpenDetail={() => onNavigate("product")}
        onSimulate={() => onNavigate("profit")}
      />
    </div>
  );
}
