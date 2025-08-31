import { api } from '@/lib/api';
import type { StudentListFilters } from '../key';

export const fetchStudents = async (filters: StudentListFilters) => {
  const response = await api.get('/students', { params: filters });
  return response.data;
};
