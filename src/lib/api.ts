import { useAuthStore } from '@/stores/authStore';
import axios, { type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  // APIのベースURLを環境変数から取得
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

// 認証情報のキャッシュ
let cachedAuthState = useAuthStore.getState().auth;

// ストアの変更を監視してキャッシュを更新
useAuthStore.subscribe((state) => {
  cachedAuthState = state.auth;
});

// ヘッダー名の定数を定義
const HEADER_ACCESS_TOKEN = 'access-token';
const HEADER_CLIENT = 'client';
const HEADER_UID = 'uid';
const HEADER_TOKEN_TYPE = 'token-type';

// リクエスト前に自動でヘッダーを付与
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // キャッシュされた認証情報を使用
    if (cachedAuthState) {
      config.headers[HEADER_ACCESS_TOKEN] = cachedAuthState['access-token'];
      config.headers[HEADER_CLIENT] = cachedAuthState.client;
      config.headers[HEADER_UID] = cachedAuthState.uid;
      config.headers[HEADER_TOKEN_TYPE] = cachedAuthState['token-type'];
    }
    return config;
  },
  (error) => {
    // リクエストエラーが発生した場合はそのままエラーを返す
    return Promise.reject(error);
  }
);
