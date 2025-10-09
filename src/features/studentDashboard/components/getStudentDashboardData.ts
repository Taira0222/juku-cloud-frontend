import { IconDashboard, IconPuzzle } from "@tabler/icons-react";

type GetStudentDashboardDataProps = {
  role: string;
  user: {
    name: string;
    email: string;
  };
  id: string;
};

export const getStudentDashboardData = ({
  role,
  user,
  id,
}: GetStudentDashboardDataProps) => {
  // role, user, id が定義されていない場合は空文字(falsy) なのでnull になる
  if (!role || !user || !id) return null;
  const navMain =
    role === "admin"
      ? [
          {
            title: "ダッシュボード",
            url: `/dashboard/${id}`,
            icon: IconDashboard,
          },
          {
            title: "特性管理",
            url: `/dashboard/${id}/student-traits`,
            icon: IconPuzzle,
          },
        ]
      : [
          {
            title: "ダッシュボード",
            url: `/dashboard/${id}`,
            icon: IconDashboard,
          },
        ];

  return {
    user,
    navMain,
  };
};
