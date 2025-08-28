import { useCallback, useEffect, useState } from 'react';
import { fetchTeachers } from '@/features/teachers/api/teachersApi';
import {
  type currentUser,
  type fetchTeachersErrorResponse,
  type teachers,
} from '@/features/teachers/types/teachers';
import { isAxiosError } from 'axios';

const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

export const useFetchTeachers = () => {
  const [currentUserData, setCurrentUserData] = useState<currentUser | null>(
    null
  );
  const [teachersData, setTeachersData] = useState<teachers>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加
  const fetchTeachersData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchTeachers();
      setCurrentUserData(response.data.current_user);
      setTeachersData(response.data.teachers);
    } catch (err) {
      let errorMessage = DEFAULT_ERROR_MESSAGE;
      if (isAxiosError<fetchTeachersErrorResponse>(err)) {
        errorMessage = err.response?.data?.error || DEFAULT_ERROR_MESSAGE;
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachersData();
  }, [fetchTeachersData]);

  return {
    currentUserData,
    teachersData,
    error,
    loading,
    refetch: fetchTeachersData,
  };
};
