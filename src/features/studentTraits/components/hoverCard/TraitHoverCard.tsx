import { Button } from "@/components/ui/form/Button/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/layout/HoverCard/hover-card";
import { cn } from "@/lib/utils";
import { TraitHoverBadge } from "../../utils/traitHoverBadge";
import type { StudentTraitType } from "../../types/studentTraits";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type TraitHoverCardProps = {
  trait: StudentTraitType;
  isMobile: boolean;
  className?: string;
};

export const TraitHoverCard = ({
  trait,
  isMobile,
  className,
}: TraitHoverCardProps) => {
  const { TraitIcon } = TraitHoverBadge({ category: trait.category, isMobile });
   const TriggerButton = (
    <Button
      variant="link"
      className={cn(
        "py-0 font-normal text-gray-600 whitespace-normal text-left",
        isMobile ? "text-xs h-8" : "text-sm",
        className
      )}
    >
      {trait.title}
    </Button>
  );

  const ContentInner = (
    <div className="flex justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {TraitIcon}
          <h4 className="text-sm font-semibold">{trait.title}</h4>
        </div>
        <p className="text-sm">{trait.description || "詳細説明はありません。"}</p>
      </div>
    </div>
  );
  if (isMobile) {
    return(
      <Popover>
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent className="w-80">{ContentInner}</PopoverContent>
      </Popover>
    )
  }
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {TriggerButton}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {ContentInner}
      </HoverCardContent>
    </HoverCard>
  );
};
