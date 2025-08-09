import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { fetchUser } from '../services/userApi';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export const useFetchUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

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
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          clearUser(); // エラー時はユーザー情報をnullに設定
        }
      }
    };

    // 更新ボタンを押したときやwindow を閉じたときに再度ユーザー情報を取得
    if (!user) {
      fetchUserData();
    }
  }, [setUser, setAuth, user]);
};
