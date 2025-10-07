import { api } from "@/lib/api";
import {
  studentTraitSchema,
  type StudentTraitCreateRequest,
} from "../types/studentTraits";

export const CreateStudentTrait = async (value: StudentTraitCreateRequest) => {
  const { data } = await api.post("/student_traits", value);
  return studentTraitSchema.parse(data);
};
