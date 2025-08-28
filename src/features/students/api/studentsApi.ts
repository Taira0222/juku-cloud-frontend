import { api } from '@/lib/api';
import type { fetchStudentsResponse } from '../types/students';

export const fetchStudents = async (): Promise<fetchStudentsResponse> => {
  const response = await api.get<fetchStudentsResponse>('/students');
  return response.data;
};
