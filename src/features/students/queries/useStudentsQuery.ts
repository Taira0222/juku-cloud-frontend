import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchStudents } from '../api/studentsApi';
import { studentKeys, type StudentListFilters } from '../key';
import { fetchStudentsSuccessResponseSchema } from '../types/students';
import { z } from 'zod';

export const useStudentsQuery = (filters: StudentListFilters) =>
  useQuery<z.infer<typeof fetchStudentsSuccessResponseSchema>>({
    queryKey: studentKeys.list(filters),
    queryFn: () => fetchStudents(filters),
    placeholderData: keepPreviousData,
  });
