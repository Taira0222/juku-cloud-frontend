import { useAuthStore } from '@/stores/authStore';
import axios, { type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  // APIのベースURLを環境変数から取得
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

// ヘッダー名の定数を定義
const HEADER_ACCESS_TOKEN = 'access-token';
const HEADER_CLIENT = 'client';
const HEADER_UID = 'uid';
const HEADER_TOKEN_TYPE = 'token-type';
const HEADER_EXPIRY = 'expiry';

// リクエスト前に自動でヘッダーを付与
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // キャッシュによる一貫性の問題を解決するため、storeから直接取得するように変更
    // これにより、最新の認証情報が常に使用されるようにする
    const auth = useAuthStore.getState().auth;
    if (auth) {
      config.headers[HEADER_ACCESS_TOKEN] = auth['access-token'];
      config.headers[HEADER_CLIENT] = auth.client;
      config.headers[HEADER_UID] = auth.uid;
      config.headers[HEADER_TOKEN_TYPE] = auth['token-type'];
      config.headers[HEADER_EXPIRY] = auth.expiry;
    }
    return config;
  },
  (error) => {
    // リクエストエラーが発生した場合はそのままエラーを返す
    return Promise.reject(error);
  }
);
