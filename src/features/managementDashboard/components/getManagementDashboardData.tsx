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
        ]
      : [
          {
            title: '生徒一覧',
            url: '/students_management',
            icon: IconUser,
          },
        ];

  return {
    user,
    navMain,
  };
};
