import { api } from '@/lib/api';
import { create } from 'zustand';
import { useAuthStore } from './authStore';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type UserState = {
  user: User | null;
  fetchUser: () => Promise<void>;
};
const setAuth = useAuthStore.getState().setAuth;

// ヘッダー名の定数を定義
const HEADER_ACCESS_TOKEN = 'access-token';
const HEADER_CLIENT = 'client';
const HEADER_UID = 'uid';
const HEADER_TOKEN_TYPE = 'token-type';
const HEADER_EXPIRY = 'expiry';

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初期値はnull
  fetchUser: async () => {
    try {
      const response = await api.get('/auth/validate_token');
      set({
        user: {
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
          role: response.data.data.role,
        },
      });
      if (response.headers[HEADER_ACCESS_TOKEN]) {
        // 認証情報を更新
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
        set({ user: null }); // エラー時はユーザー情報をnullに設定
      }
    }
  },
}));
