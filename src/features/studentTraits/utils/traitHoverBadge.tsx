import { Badge } from "@/components/ui/display/Badge/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { TRAIT_CONFIG } from "../constants/StudentTraitTable";
import type { CategoryType } from "../types/studentTraits";

type TraitHoverBadgeProps = {
  category: CategoryType;
  isMobile: boolean;
};

export const TraitHoverBadge = ({
  category,
  isMobile,
}: TraitHoverBadgeProps) => {
  const TraitIcon =
    category === "good" ? (
      <CheckCircle
        className={cn("text-emerald-300", isMobile ? "size-3" : "size-4")}
        aria-hidden
      />
    ) : (
      <AlertTriangle
        className={cn("text-amber-300", isMobile ? "size-3" : "size-4")}
        aria-hidden
      />
    );

  const TraitBadge = () => {
    const badgeColor = TRAIT_CONFIG[category].color;
    const badgeText = TRAIT_CONFIG[category].text;

    return (
      <Badge
        variant="outline"
        color={badgeColor}
        className={cn(
          "text-muted-foreground px-1.5 mx-1",
          isMobile ? "text-xs h-6" : "text-sm h-7"
        )}
      >
        <div className="flex items-center gap-1">
          {TraitIcon}
          <span>{badgeText}</span>
        </div>
      </Badge>
    );
  };

  return { TraitIcon, TraitBadge };
};
