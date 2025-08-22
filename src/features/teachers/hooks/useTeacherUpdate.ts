import { useCallback, useState } from 'react';
import { isAxiosError } from 'axios';
import type {
  updateTeacherErrorResponse,
  updateTeacherRequest,
} from '../types/teachers';
import { updateTeacherApi } from '../services/updateTeacherApi';

const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

export const useTeacherUpdate = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateTeacher = useCallback(
    async (teacherId: number, formData: updateTeacherRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateTeacherApi(teacherId, formData);
        const responseTeacherId = response.data.teacher_id;
        return { ok: true, updatedId: responseTeacherId };
      } catch (err) {
        let errorMessage = DEFAULT_ERROR_MESSAGE;
        if (isAxiosError<updateTeacherErrorResponse>(err)) {
          errorMessage = err.response?.data.error ?? DEFAULT_ERROR_MESSAGE;
        } else if (err instanceof Error && err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { error, loading, updateTeacher };
};
