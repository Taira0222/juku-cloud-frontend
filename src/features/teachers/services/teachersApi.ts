import { api } from '@/lib/api';
import type { fetchTeachersResponse } from '../types/teachers';

export const fetchTeachers = async (): Promise<fetchTeachersResponse> => {
  const response = await api.get<fetchTeachersResponse>('/teachers');
  return response.data;
};
