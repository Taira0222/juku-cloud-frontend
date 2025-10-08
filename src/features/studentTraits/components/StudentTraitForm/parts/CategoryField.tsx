import { Label } from "@/components/ui/form/Label/label";
import type { CategoryType } from "@/features/studentTraits/types/studentTraits";
import { TraitHoverBadge } from "@/features/studentTraits/utils/traitHoverBadge";
import { useIsMobile } from "@/hooks/useMobile";

export type CategoryFieldProps = {
  category?: CategoryType;
};

export const CategoryField = ({ category }: CategoryFieldProps) => {
  if (!category) {
    return <div className="text-red-500">不明な特性</div>;
  }
  const isMobile = useIsMobile();
  const { TraitBadge } = TraitHoverBadge({
    category: category,
    isMobile: isMobile,
  });

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">特性</Label>
      <span className="text-gray-700">{<TraitBadge />}</span>
    </div>
  );
};
