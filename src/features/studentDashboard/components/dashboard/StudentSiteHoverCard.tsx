import { Button } from "@/components/ui/form/Button/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/layout/HoverCard/hover-card";

type HoverCardGenericProps = {
  name: string;
  grade: string;
  desiredSchool: string;
};

export const StudentSiteHoverCard = ({
  name,
  grade,
  desiredSchool,
}: HoverCardGenericProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="ml-auto flex items-center">
          <span className="text-sm text-muted-foreground">氏名</span>
          <span className="font-medium">{name}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60">
        <div className="flex justify-between">
          <div className="space-y-1 text-sm text-gray-600">
            <div className="ml-auto flex items-center gap-2">
              <div className="text-muted-foreground">学年</div>
              <div className="font-medium"> {grade}</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="text-muted-foreground">志望校</div>
              <div className="font-medium">{desiredSchool}</div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
