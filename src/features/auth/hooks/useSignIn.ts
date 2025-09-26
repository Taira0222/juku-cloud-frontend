import { useAuthStore } from "@/stores/authStore";
import { signInApi } from "../api/signInApi";
import { useCallback, useState } from "react";
import { useWarningStore } from "@/stores/warningStore";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { parseAuthHeader } from "../utils/parseAuthHeader";

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
        const authHeader = parseAuthHeader(response.headers);

        if (authHeader) {
          setAuth(authHeader);
          return { ok: true as const };
        } else {
          // 認証ヘッダーが不足している場合のエラー処理
          setError(["認証情報の取得に失敗しました。"]);
          return { ok: false as const };
        }
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
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
