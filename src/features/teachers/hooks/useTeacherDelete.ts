import { useCallback, useState } from 'react';
import { isAxiosError } from 'axios';
import { deleteTeacherApi } from '../services/deleteTeacherApi';
import type { teacherDeleteErrorResponse } from '../types/teachers';

const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

export const useTeacherDelete = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const deleteTeacher = useCallback(async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTeacherApi(teacherId);
      return { ok: true as const };
    } catch (err) {
      let errorMessage = DEFAULT_ERROR_MESSAGE;
      if (isAxiosError<teacherDeleteErrorResponse>(err)) {
        errorMessage = err.response?.data.error ?? DEFAULT_ERROR_MESSAGE;
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, deleteTeacher };
};
