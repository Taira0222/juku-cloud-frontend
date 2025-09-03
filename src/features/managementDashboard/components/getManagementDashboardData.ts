import { IconUser, IconUserStar } from '@tabler/icons-react';

type GetManagementDashboardDataProps = {
  role: string;
  user: {
    name: string;
    email: string;
  };
};

export const getManagementDashboardData = ({
  role,
  user,
}: GetManagementDashboardDataProps) => {
  if (!role || !user) return null;
  const navMain =
    role === 'admin'
      ? [
          {
            title: '生徒一覧',
            url: '/students',
            icon: IconUser,
          },
          {
            title: '講師一覧',
            url: '/teachers',
            icon: IconUserStar,
          },
        ]
      : [
          {
            title: '生徒一覧',
            url: '/students',
            icon: IconUser,
          },
        ];

  return {
    user,
    navMain,
  };
};
