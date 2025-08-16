import { useUserStore } from '@/stores/userStore';
import { useEffect, useState } from 'react';
import { fetchUser } from '../services/userApi';
import { isAxiosError } from 'axios';
import type { fetchUserErrorResponse } from '../types/user';

export const useFetchUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  const [error, setError] = useState<string[] | null>(null);
  const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUser();
        if (response.data && response.data.data) {
          setUser({
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: response.data.data.role,
            school: response.data.data.school.name,
          });
        }
      } catch (err) {
        let errorMessage = [DEFAULT_ERROR_MESSAGE];
        if (isAxiosError<fetchUserErrorResponse>(err)) {
          errorMessage = err.response?.data.errors || [DEFAULT_ERROR_MESSAGE];
        } else if (err instanceof Error && err.message) {
          errorMessage = [err.message];
        }
        clearUser(); // エラー時はユーザー情報をnullにして再度ログインさせる
        setError(errorMessage);
      }
    };

    // 更新ボタンを押したときやwindow を閉じたときに再度ユーザー情報を取得
    if (!user) {
      fetchUserData();
    }
  }, [setUser, user]);

  // error は配列であることに注意
  return { error };
};
