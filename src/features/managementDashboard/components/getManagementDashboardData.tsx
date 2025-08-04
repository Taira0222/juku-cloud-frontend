import {
  IconBook2,
  IconBooks,
  IconUser,
  IconUserStar,
} from '@tabler/icons-react';

type GetManagementDashboardDataProps = {
  role: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
};

export const getManagementDashboardData = ({
  role,
  user,
}: GetManagementDashboardDataProps) => {
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
          {
            title: '指導科目',
            url: '/subjects',
            icon: IconBook2,
          },
          {
            title: '使用教材',
            url: '/learning_materials',
            icon: IconBooks,
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
