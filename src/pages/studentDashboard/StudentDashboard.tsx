import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import { SiteHeader } from "@/components/common/dashboard/site-header";
import SpinnerWithText from "@/components/common/status/Loading";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/layout/Sidebar/sidebar";
import { getStudentDashboardData } from "@/features/studentDashboard/components/getStudentDashboardData";
import { useStudentDetailQuery } from "@/features/studentDashboard/queries/useStudentDetailQuery";
import type { User } from "@/stores/userStore";
import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";

export const StudentDashboard = () => {
  const user = useOutletContext<User>();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  // 整数でない、または0以下の数値なら404へリダイレクト
  if (!Number.isInteger(studentId) || studentId <= 0)
    return <Navigate to="404" replace />;

  const query = useStudentDetailQuery(studentId);

  const sidebarData = getStudentDashboardData({
    role: user.role,
    user: {
      name: user.name,
      email: user.email,
    },
    id: studentId.toString(),
  });

  if (!sidebarData || query.isPending)
    return (
      <div className="p-6">
        <SpinnerWithText className="flex items-center justify-center h-32">
          Loading...
        </SpinnerWithText>
      </div>
    );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/** ここがサイドバー部分 */}
      <AppSidebar variant="inset" data={sidebarData} />
      {/** ここがメイン部分 */}
      <SidebarInset>
        <SiteHeader school={user?.school ?? null} />
        <div className="flex flex-1 flex-col">
          {/** ここがメインコンテンツ部分 */}

          <Outlet context={query} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
