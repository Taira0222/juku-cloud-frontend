import { api } from "@/lib/api";
import { StudentDetailSchema } from "../type/studentDashboard";

export const fetchStudent = async (studentId: number) => {
  const { data } = await api.get(`/dashboards/${studentId}`);
  return StudentDetailSchema.parse(data);
};
