import { api } from "@/lib/api";
import {
  studentTraitSchema,
  type StudentTraitUpdateRequest,
} from "../types/studentTraits";

export const UpdateStudentTrait = async (value: StudentTraitUpdateRequest) => {
  const { data } = await api.patch(`/student_traits/${value.id}`, value);
  return studentTraitSchema.parse(data);
};
