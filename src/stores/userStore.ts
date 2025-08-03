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

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初期値はnull
  fetchUser: async () => {
    const response = await api.get('/auth/validate_token');
    set({
      user: {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
      },
    });
    // トークンローテーションのために認証情報を更新
    const setAuth = useAuthStore.getState().setAuth;
    if (response.headers['access-token']) {
      // 認証情報を更新
      setAuth({
        'access-token': response.headers['access-token'],
        client: response.headers['client'],
        uid: response.headers['uid'],
        'token-type': response.headers['token-type'],
        expiry: response.headers['expiry'],
      });
    }
  },
  // エラーハンドリングを追加
  catch(err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('APIエラー:', err.response?.data || err.message);
    }
    set({ user: null }); // エラー時はユーザー情報をnullに設定
  },
}));
