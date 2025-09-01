import { api } from '@/lib/api';
import type { StudentListFilters } from '../key';
import { fetchStudentsSuccessResponseSchema } from '../types/students';

export const fetchStudents = async (filters: StudentListFilters) => {
  const { data } = await api.get('/students', { params: filters });
  return fetchStudentsSuccessResponseSchema.parse(data);
};
