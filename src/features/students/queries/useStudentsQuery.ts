import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/studentsApi";
import { studentKeys, type StudentListFilters } from "../../key";
import { fetchStudentsSuccessResponseSchema } from "../types/students";
import { z } from "zod";

// EditStudentDialog で利用
type Opts = { enabled?: boolean };
export const useStudentsQuery = (filters: StudentListFilters, opts?: Opts) =>
  useQuery<z.infer<typeof fetchStudentsSuccessResponseSchema>, unknown>({
    queryKey: studentKeys.list(filters),
    queryFn: () => fetchStudents(filters),
    placeholderData: keepPreviousData,
    ...opts,
  });
