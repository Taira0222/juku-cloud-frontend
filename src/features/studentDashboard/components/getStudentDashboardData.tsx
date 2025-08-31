import { IconUser, IconUserStar } from '@tabler/icons-react';

type GetStudentDashboardDataProps = {
  role: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
  id?: string;
};

export const getStudentDashboardData = ({
  role,
  user,
  id,
}: GetStudentDashboardDataProps) => {
  const navMain =
    role === 'admin'
      ? [
          {
            title: 'ダッシュボード',
            url: `/dashboard/${id}`,
            icon: IconUser,
          },
          {
            title: '特性管理',
            url: '/teachers',
            icon: IconUserStar,
          },
        ]
      : [
          {
            title: 'ダッシュボード',
            url: `/dashboard/${id}`,
            icon: IconUser,
          },
        ];

  return {
    user,
    navMain,
  };
};
