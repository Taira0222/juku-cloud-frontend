import { api } from "@/lib/api";

export const studentDelete = async (studentId: number) => {
  const { data } = await api.delete(`/students/${studentId}`);

  return data;
};
