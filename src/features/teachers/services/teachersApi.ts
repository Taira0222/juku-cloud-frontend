import { api } from '@/lib/api';
import type { fetchTeachersResponse } from '../types/teacher';

export const fetchTeachers = async (): Promise<fetchTeachersResponse> => {
  const response = await api.get<fetchTeachersResponse>('/teachers');
  return response.data;
};
