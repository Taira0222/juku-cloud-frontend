import { api } from "@/lib/api";
import { studentSchema, type createStudentPayload } from "../types/students";

export const studentCreate = async (payload: createStudentPayload) => {
  const { data } = await api.post("/students", payload);

  return studentSchema.parse(data);
};
