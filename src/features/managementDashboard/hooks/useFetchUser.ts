import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { fetchUser } from '../services/useApi';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export const useFetchUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useUserStore((state) => state.user);

  // ヘッダー名の定数を定義
  const HEADER_ACCESS_TOKEN = 'access-token';
  const HEADER_CLIENT = 'client';
  const HEADER_UID = 'uid';
  const HEADER_TOKEN_TYPE = 'token-type';
  const HEADER_EXPIRY = 'expiry';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUser();
        // response.data の構造に応じて修正
        if (response.data && response.data.data) {
          setUser({
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            role: response.data.data.role,
          });
        }
        if (response.headers[HEADER_ACCESS_TOKEN]) {
          setAuth({
            [HEADER_ACCESS_TOKEN]: response.headers[HEADER_ACCESS_TOKEN],
            [HEADER_CLIENT]: response.headers[HEADER_CLIENT],
            [HEADER_UID]: response.headers[HEADER_UID],
            [HEADER_TOKEN_TYPE]: response.headers[HEADER_TOKEN_TYPE],
            [HEADER_EXPIRY]: response.headers[HEADER_EXPIRY],
          });
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setUser(null); // エラー時はユーザー情報をnullに設定
        }
      }
    };

    fetchUserData(); // 非同期関数を呼び出す
  }, [setUser, setAuth, user, fetchUser]);
};
