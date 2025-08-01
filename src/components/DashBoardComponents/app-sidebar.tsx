import * as React from 'react';
import {
  IconBook2,
  IconBooks,
  IconUser,
  IconUserStar,
} from '@tabler/icons-react';

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

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: '生徒一覧',
      url: '/students_management',
      icon: IconUser,
    },
    {
      title: '講師一覧',
      url: '/teachers_management',
      icon: IconUserStar,
    },
    {
      title: '指導科目',
      url: '/subjects_management',
      icon: IconBook2,
    },
    {
      title: '使用教材',
      url: '/materials_management',
      icon: IconBooks,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
