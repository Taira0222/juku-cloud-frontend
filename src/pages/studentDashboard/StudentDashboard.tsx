import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import { StudentSiteHeader } from "@/features/studentDashboard/components/dashboard/StudentSiteHeader";
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
  const { studentId } = useParams<{ studentId: string }>();
  const studentIdNumber = Number(studentId);
  // 整数でない、または0以下の数値なら404へリダイレクト
  if (!Number.isInteger(studentIdNumber) || studentIdNumber <= 0)
    return <Navigate to="/404" replace />;

  const query = useStudentDetailQuery(studentIdNumber);

  const sidebarData = getStudentDashboardData({
    role: user.role,
    user: {
      name: user.name,
      email: user.email,
    },
    id: studentIdNumber.toString(),
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
        {query.data && (
          <StudentSiteHeader school={user.school} data={query.data} />
        )}
        <div className="flex flex-1 flex-col">
          {/** ここがメインコンテンツ部分 */}

          <Outlet context={{ query, role: user.role }} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
