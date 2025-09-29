import { api } from "@/lib/api";
import { StudentDetailSchema } from "../type/studentDashboard";

export const fetchStudent = async (studentId: number) => {
  const { data } = await api.get(`/dashboards/${studentId}`);
  console.log(data);
  return StudentDetailSchema.parse(data);
};
