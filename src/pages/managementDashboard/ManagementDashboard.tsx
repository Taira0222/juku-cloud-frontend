import { AppSidebar } from '@/components/common/dashboard/app-sidebar';
import { SiteHeader } from '@/components/common/dashboard/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/layout/Sidebar/sidebar';
import { useUserStore } from '@/stores/userStore';
import { Outlet } from 'react-router-dom';
import { getManagementDashboardData } from '@/features/managementDashboard/components/getManagementDashboardData';
import SpinnerWithText from '@/components/common/status/Loading';

export const ManagementDashboard = () => {
  const user = useUserStore((state) => state.user);

  const data = getManagementDashboardData({
    role: user?.role ?? '',
    user: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  if (!data)
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
