import { useAuthStore } from '@/stores/authStore';
import axios, { type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  // APIのベースURLを環境変数から取得
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

// リクエスト前に自動でヘッダーを付与
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 認証情報が存在する場合、リクエストヘッダーに追加
    // useAuthStoreから現在の認証情報を取得
    const auth = useAuthStore.getState().auth;
    // authが存在する場合、ヘッダーに設定
    if (auth) {
      config.headers['access-token'] = auth['access-token'];
      config.headers['client'] = auth.client;
      config.headers['uid'] = auth.uid;
      config.headers['token-type'] = auth['token-type'];
    }
    return config;
  },
  (error) => {
    // リクエストエラーが発生した場合はそのままエラーを返す
    return Promise.reject(error);
  }
);
