import { Button } from "@/components/ui/form/Button/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/layout/HoverCard/hover-card";
import type { studentTrait } from "@/features/studentDashboard/type/studentDashboard";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

type TraitHoverCardProps = {
  trait: studentTrait;
  isMobile: boolean;
};

export const TraitHoverCard = ({ trait, isMobile }: TraitHoverCardProps) => {
  const Icon =
    trait.category === "good" ? (
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
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "py-0 font-normal text-gray-600 whitespace-normal text-left",
            isMobile ? "text-xs h-8" : "text-sm"
          )}
        >
          {trait.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {Icon}
              <h4 className="text-sm font-semibold">{trait.title}</h4>
            </div>
            <p className="text-sm">
              {trait.description || "詳細説明はありません。"}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
