import { Separator } from "@/components/ui/layout/Separator/separator";
import { SidebarTrigger } from "@/components/ui/layout/Sidebar/sidebar";
import type { StudentDetail } from "@/features/studentDashboard/type/studentDashboard";
import { useIsMobile } from "@/hooks/useMobile";
import { formatGrade } from "@/utils/formatGrade";
import { StudentSiteHoverCard } from "./StudentSiteHoverCard";

type SiteHeaderProps = {
  school: string | null;
  data: StudentDetail;
};

export const StudentSiteHeader = ({ school, data }: SiteHeaderProps) => {
  const isMobile = useIsMobile();
  const formattedGrade = formatGrade(data.school_stage, data.grade);
  const desiredSchool = data.desired_school ?? "未設定";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="ml-auto flex items-center">
          {!isMobile && (
            <>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <div className="text-muted-foreground">学年</div>
                <div className="font-medium text-gray-600">
                  {formattedGrade}
                </div>
              </div>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />

              <div className="ml-auto flex items-center gap-2 text-sm">
                <div className="text-muted-foreground">氏名</div>
                <div className="font-medium text-gray-600">{data.name}</div>
              </div>

              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <div className="ml-auto flex items-center gap-2 text-sm">
                <div className="text-muted-foreground">志望校</div>
                <div className="font-medium text-gray-600">{desiredSchool}</div>
              </div>
            </>
          )}
          {isMobile && (
            <>
              <StudentSiteHoverCard
                name={data.name}
                grade={formattedGrade}
                desiredSchool={desiredSchool}
              />
            </>
          )}
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="text-sm font-medium text-gray-600">{school}</div>
        </div>
      </div>
    </header>
  );
};
