import { api } from "@/lib/api";
import type { StudentTraitDeletePayload } from "../types/studentTraits";

export const DeleteStudentTrait = async ({
  studentId,
  studentTraitId,
}: StudentTraitDeletePayload) => {
  const { data } = await api.delete(`/student_traits/${studentTraitId}`, {
    params: { student_id: studentId },
  });
  return data;
};
