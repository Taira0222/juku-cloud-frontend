import { api } from '@/lib/api';
import type { fetchStudentsResponse } from '../types/students';

export const fetchStudents = async (): Promise<fetchStudentsResponse> => {
  const response = await api.get<fetchStudentsResponse>('/students');
  console.log(response.data);
  return response.data;
};
