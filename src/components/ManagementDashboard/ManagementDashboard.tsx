import { AppSidebar } from '@/components/DashBoardComponents/app-sidebar';
import { SiteHeader } from '@/components/DashBoardComponents/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export const ManagementDashboard = () => {
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
      <AppSidebar variant="inset" />
      {/** ここがメイン部分 */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {/** ここがメインコンテンツ部分 */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
