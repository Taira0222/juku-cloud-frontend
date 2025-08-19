import { api } from '@/lib/api';

export const deleteTeacherApi = async (teacherId: number) => {
  const response = await api.delete(`/teachers/${teacherId}`);
  return response;
};
