import { api } from '@/lib/api';
import type {
  updateTeacherRequest,
  updateTeacherSuccessResponse,
} from '../types/teachers';

export const updateTeacherApi = async (
  id: number,
  formData: updateTeacherRequest
) => {
  const response = await api.patch<updateTeacherSuccessResponse>(
    `/teachers/${id}`,
    formData
  );
  return response;
};
