import type { DashboardContextType } from "@/pages/dashboard/type/dashboard";

export type StudentTraitsContextType = {
  query: DashboardContextType["query"];
  studentId: number;
};
