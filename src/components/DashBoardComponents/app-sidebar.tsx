import * as React from 'react';

import { NavMain } from '@/components/DashBoardComponents/nav-main';
import { NavUser } from '@/components/DashBoardComponents/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CloudCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Icon, IconProps } from '@tabler/icons-react';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  data: {
    user: {
      name: string | null;
      email: string | null;
    };
    navMain: {
      title: string;
      url: string;
      icon: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<Icon>
      >;
    }[];
  };
};

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/** juku cloud の名前とアイコン */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="students_management">
                <CloudCog className="!size-5" />
                <span className="text-base font-semibold">Juku Cloud</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/** ここがサイドバー部分 */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/** ここがフッター部分 */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
