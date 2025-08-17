import { api } from '@/lib/api';
import type { fetchTeachersSuccessResponse } from '../types/teachers';

export const fetchTeachers = async () => {
  const response = await api.get<fetchTeachersSuccessResponse>('/teachers');
  return response;
};
