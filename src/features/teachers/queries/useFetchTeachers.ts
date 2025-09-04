import { useCallback, useEffect, useState } from 'react';
import { fetchTeachers } from '@/features/teachers/api/teachersApi';
import {
  type currentUser,
  type fetchTeachersErrorResponse,
  type teachers,
} from '@/features/teachers/types/teachers';
import { isAxiosError } from 'axios';

const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

export const useFetchTeachers = (enabled: boolean = true) => {
  const [currentUserData, setCurrentUserData] = useState<currentUser | null>(
    null
  );
  const [teachersData, setTeachersData] = useState<teachers>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);

  // リクエストがキャンセルされたかどうかを判定する関数
  const isCanceled = (err: unknown) =>
    isAxiosError(err) && err.code === 'ERR_CANCELED';

  const fetchTeachersData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchTeachers(signal);
      setCurrentUserData(response.data.current_user);
      setTeachersData(response.data.teachers);
    } catch (err) {
      if (isCanceled(err)) return;
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
    // CreateStudentDialog などで enabled を false にしている場合があるので、その場合は fetch しない
    if (!enabled) {
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    fetchTeachersData(ac.signal);
    // enabled が false になるか unmount 時に abort する
    return () => ac.abort();
  }, [enabled, fetchTeachersData]);

  return {
    currentUserData,
    teachersData,
    error,
    loading,
    refetch: fetchTeachersData,
  };
};
