import { useAuthStore } from '@/stores/authStore';
import { useNavStore } from '@/stores/navStore';
import { useWarningStore } from '@/stores/warningStore';
import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

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
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

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
    const { setAuth } = useAuthStore.getState();
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
    // Axios 以外 → 触らず返す（コードバグなど）
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }
    // キャンセルエラー → 触らず返す
    if (isAxiosError(error) && error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    if (!error.response) {
      toast.error(
        '通信エラーが発生しました。接続を確認して再度お試しください。'
      );
      return Promise.reject(error);
    }

    // ここから下は "AxiosError かつ response あり" が確定
    const status = error.response.status;
    const cfg = error.config as AxiosRequestConfig | undefined;

    const { clearAuth } = useAuthStore.getState();
    const { setNextPath } = useNavStore.getState();
    const { setWarningMessage } = useWarningStore.getState();

    // ステータスによるエラー
    switch (status) {
      case HTTP_STATUS_UNAUTHORIZED:
        clearAuth();
        if (!cfg?.suppressAuthRedirect) {
          setWarningMessage('認証情報が不完全です。ログインしてください。');
          setNextPath('/sign_in', { replace: true });
        }
        break;
      case HTTP_STATUS_FORBIDDEN:
        setNextPath('/forbidden');
        break;
      case HTTP_STATUS_NOT_FOUND:
        setNextPath('/404');
        break;
      case HTTP_STATUS_INTERNAL_SERVER_ERROR:
        setNextPath('/internal_server_error');
        break;
    }

    // 422 や 400のエラーをそのまま投げる
    return Promise.reject(error);
  }
);
