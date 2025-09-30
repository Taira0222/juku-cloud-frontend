import type {
  CategoryType,
  studentTrait,
} from "@/features/studentDashboard/type/studentDashboard";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { TraitHoverCard } from "./hoverCard/TraitHoverCard";
import { cn } from "@/lib/utils";

type TraitFieldProps = {
  cardTitle: string;
  traits: studentTrait[];
  isMobile: boolean;
  category: CategoryType;
};

export const StudentTraitField = ({
  cardTitle,
  traits,
  isMobile,
  category,
}: TraitFieldProps) => {
  const isGood = category === "good";

  const traitIcon = isGood ? (
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
    <section
      className={cn(
        "border-l-4 pl-3",
        isGood ? "border-l-emerald-200" : "border-l-amber-200"
      )}
    >
      {/* セクション見出し */}
      <h3
        className={cn(
          "mb-2 flex items-center gap-2 font-medium text-muted-foreground",
          isMobile ? "text-xs" : "text-sm"
        )}
      >
        {traitIcon}
        {cardTitle}
      </h3>

      <div
        className={cn(
          "pr-2",
          isMobile ? "max-h-24" : "max-h-28",
          "overflow-y-auto"
        )}
      >
        {traits.length === 0 ? (
          <p
            className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            特性が登録されていません
          </p>
        ) : (
          <ul className="space-y-1">
            {traits.map((trait) => (
              <li
                key={trait.id}
                className={cn(
                  "rounded-md",
                  isMobile ? "text-[11px] leading-5" : "text-sm leading-6",
                  // 行ホバーでうっすら背景（カードなしでも触れる要素だと分かる）
                  "hover:bg-muted/40 transition-colors"
                )}
              >
                <TraitHoverCard trait={trait} isMobile={isMobile} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
