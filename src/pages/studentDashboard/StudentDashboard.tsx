import { AppSidebar } from '@/components/common/dashboard/app-sidebar';
import { SiteHeader } from '@/components/common/dashboard/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/layout/Sidebar/sidebar';
import { getStudentDashboardData } from '@/features/studentDashboard/components/getStudentDashboardData';
import { useUserStore } from '@/stores/userStore';
import { Outlet, useParams } from 'react-router-dom';

export const StudentDashboard = () => {
  const user = useUserStore((state) => state.user);
  const { id } = useParams<{ id: string }>();

  const data = getStudentDashboardData({
    role: user?.role ?? null,
    user: {
      name: user?.name ?? null,
      email: user?.email ?? null,
    },
    id,
  });

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      {/** ここがサイドバー部分 */}
      <AppSidebar variant="inset" data={data} />
      {/** ここがメイン部分 */}
      <SidebarInset>
        <SiteHeader school={user?.school ?? null} />
        <div className="flex flex-1 flex-col">
          {/** ここがメインコンテンツ部分 */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
