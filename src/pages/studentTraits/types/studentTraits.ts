import type { DashboardContextType } from "@/pages/dashboard/type/dashboard";

export type StudentTraitsContextType = {
  student: DashboardContextType["student"];
  studentId: number;
};