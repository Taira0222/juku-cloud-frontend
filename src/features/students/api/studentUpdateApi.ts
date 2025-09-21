import { api } from "@/lib/api";
import { studentSchema, type editStudentPayload } from "../types/students";

export const studentUpdate = async (payload: editStudentPayload) => {
  const { data } = await api.patch(`/students/${payload.id}`, payload);
  return studentSchema.parse(data);
};
