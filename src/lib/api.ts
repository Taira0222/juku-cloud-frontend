import { useAuthStore } from '@/stores/authStore';
import { useNavStore } from '@/stores/navStore';
import { useWarningStore } from '@/stores/warningStore';
import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

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

// HTTPステータスコードの定数を定義
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_NOT_FOUND = 404;

// Zustand の状態をモジュールレベルで取得
const authStore = useAuthStore.getState();

// リクエスト前に自動でヘッダーを付与
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // auth は値なので、常に最新の状態を取得する
    const { auth } = useAuthStore.getState();
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
    const headers = response.headers;
    // setAuth は 更新関数なので最初のスナップショットを取得
    const { setAuth } = authStore;
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
    // AxiosError 以外はそのまま投げる
    if (!axios.isAxiosError(error)) {
      // 想定外（コードバグなど）はそのまま投げる
      return Promise.reject(error);
    }
    // clearAuth は 更新関数なので最初のスナップショットを取得
    const { clearAuth } = authStore;
    const { setNextPath } = useNavStore.getState();
    const { setWarningMessage } = useWarningStore.getState();
    const status = error.response?.status;
    const cfg = error?.config as AxiosRequestConfig | undefined;

    // ネットワーク/タイムアウト等（response が無い）
    if (!status) {
      setWarningMessage(
        'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      );
      return Promise.reject(error);
    }

    // ステータスによるエラー
    if (status === HTTP_STATUS_UNAUTHORIZED) {
      clearAuth();
      if (!cfg?.suppressAuthRedirect) {
        setWarningMessage('認証情報が不完全です。ログインしてください。');
        setNextPath('/sign_in', { replace: true });
      }
    }
    if (status === HTTP_STATUS_FORBIDDEN) {
      setNextPath('/forbidden');
    }
    if (status === HTTP_STATUS_NOT_FOUND) {
      setNextPath('/404');
    }

    return Promise.reject(error);
  }
);
