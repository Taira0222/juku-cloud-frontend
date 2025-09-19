import { api } from "@/lib/api";
import {
  updateStudentResponseSchema,
  type updateStudentPayload,
} from "../types/students";

export const studentUpdateApi = async (payload: updateStudentPayload) => {
  const { data } = await api.patch(`/students/${payload.id}`, payload);
  return updateStudentResponseSchema.parse(data);
};
