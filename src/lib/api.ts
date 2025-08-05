import { useAuthStore } from '@/stores/authStore';
import axios, { type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  // APIのベースURLを環境変数から取得
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
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

// レスポンス後に自動でトークンを更新
api.interceptors.response.use(
  (response) => {
    // レスポンスヘッダーに新しいトークンがある場合は更新
    const { setAuth } = useAuthStore.getState();
    const headers = response.headers;
    if (headers[HEADER_ACCESS_TOKEN]) {
      setAuth({
        [HEADER_ACCESS_TOKEN]: headers[HEADER_ACCESS_TOKEN],
        [HEADER_CLIENT]: headers[HEADER_CLIENT],
        [HEADER_UID]: headers[HEADER_UID],
        [HEADER_TOKEN_TYPE]: headers[HEADER_TOKEN_TYPE],
        [HEADER_EXPIRY]: headers[HEADER_EXPIRY],
      });
    }
    return response;
  },
  (error) => {
    const { clearAuth } = useAuthStore.getState();
    // 401エラーの場合は認証情報をクリア
    if (error.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(error);
  }
);
