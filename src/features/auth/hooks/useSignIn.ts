import { useAuthStore } from '@/stores/authStore';
import { signInApi } from '../services/signInApi';
import type { AuthHeader, SignInErrorResponse } from '../types/auth';
import { isAxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useWarningStore } from '@/stores/warningStore';

// ヘッダー名の定数を定義
const HEADER_ACCESS_TOKEN = 'access-token';
const HEADER_CLIENT = 'client';
const HEADER_UID = 'uid';
const HEADER_TOKEN_TYPE = 'token-type';
const HEADER_EXPIRY = 'expiry';

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const setClearWarningMessage = useWarningStore(
    (state) => state.setClearWarningMessage
  );

  const submit = useCallback(
    async (email: string, password: string) => {
      setError(null); // エラーをリセット
      setClearWarningMessage(); // 警告メッセージをクリア

      if (isSubmitting) return; // すでに送信中の場合は何もしない
      setIsSubmitting(true); // 送信中フラグを立てる

      try {
        const response = await signInApi(email, password);
        const headers = response.headers;

        // 必要なプロパティが存在するかチェック
        if (
          headers[HEADER_ACCESS_TOKEN] &&
          headers[HEADER_CLIENT] &&
          headers[HEADER_UID] &&
          headers[HEADER_TOKEN_TYPE] &&
          headers[HEADER_EXPIRY]
        ) {
          // AuthHeader型に必要なプロパティのみを抽出
          const authHeader: AuthHeader = {
            'access-token': headers[HEADER_ACCESS_TOKEN],
            client: headers[HEADER_CLIENT],
            uid: headers[HEADER_UID],
            'token-type': headers[HEADER_TOKEN_TYPE],
            expiry: headers[HEADER_EXPIRY],
          };

          setAuth(authHeader);
          return { ok: true as const };
        }
      } catch (err: unknown) {
        // エラーメッセージを配列として初期化
        let msg: string[] = [];
        if (isAxiosError<SignInErrorResponse>(err)) {
          msg = err.response?.data?.errors ?? [
            'ログインに失敗しました。もう一度お試しください。',
          ];
          // 予期せぬエラーの場合
        } else if (err instanceof Error && err.message) {
          msg = [err.message];
        }
        setError(msg);
        return { ok: false as const };
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, setAuth, setClearWarningMessage]
  );

  return { isSubmitting, error, submit };
};
