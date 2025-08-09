import { AppSidebar } from '@/components/common/dashboard/app-sidebar';
import { SiteHeader } from '@/components/common/dashboard/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/layout/Sidebar/sidebar';
import { useUserStore } from '@/stores/userStore';
import { Outlet } from 'react-router-dom';
import { getManagementDashboardData } from '@/features/managementDashboard/components/getManagementDashboardData';
import { useFetchUser } from '@/features/managementDashboard/hooks/useFetchUser';

export const ManagementDashboard = () => {
  const user = useUserStore((state) => state.user);
  // ユーザーデータを取得するカスタムフック
  useFetchUser();

  const data = getManagementDashboardData({
    role: user?.role ?? null,
    user: {
      name: user?.name ?? null,
      email: user?.email ?? null,
    },
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
