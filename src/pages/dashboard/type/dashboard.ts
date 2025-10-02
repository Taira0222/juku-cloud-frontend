import type { StudentDetail } from "@/features/studentDashboard/type/studentDashboard";
import type { userRole } from "@/features/students/types/students";
import type { UseQueryResult } from "@tanstack/react-query";

export type DashboardContextType = {
  query: UseQueryResult<StudentDetail, unknown>;
  role: userRole;
  studentId: number;
};
