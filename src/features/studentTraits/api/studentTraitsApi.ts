import { api } from "@/lib/api";
import type { StudentTraitListFilters } from "../key";
import { fetchStudentTraitsSchema } from "../types/studentTraits";

export const FetchStudentTraits = async (filters: StudentTraitListFilters) => {
  const { data } = await api.get("/student_traits", { params: filters });
  return fetchStudentTraitsSchema.parse(data);
};
