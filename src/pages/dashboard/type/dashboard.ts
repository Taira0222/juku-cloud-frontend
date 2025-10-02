import type { StudentDetail } from "@/features/studentDashboard/type/studentDashboard";
import type { userRole } from "@/features/students/types/students";
import type { FetchStudentTraitsResponse } from "@/features/studentTraits/types/studentTraits";
import type { UseQueryResult } from "@tanstack/react-query";

export type DashboardContextType = {
  student: StudentDetail;
  studentTraits: UseQueryResult<FetchStudentTraitsResponse, unknown>;
  role: userRole;
  studentId: number;
};
