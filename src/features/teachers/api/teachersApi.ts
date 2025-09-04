import { api } from '@/lib/api';
import type { fetchTeachersSuccessResponse } from '../types/teachers';

export const fetchTeachers = async (signal?: AbortSignal) => {
  const response = await api.get<fetchTeachersSuccessResponse>('/teachers', {
    signal,
  });
  return response;
};
