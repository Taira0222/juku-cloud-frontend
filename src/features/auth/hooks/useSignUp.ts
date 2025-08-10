import { isAxiosError } from 'axios';
import { signUpApi } from '../services/signUpApi';
import type { SignUpErrorResponse, SignUpRequestData } from '../types/signUp';
import { useCallback, useState } from 'react';
import { useWarningStore } from '@/stores/warningStore';

export const useSignUp = () => {
  const [error, setError] = useState<string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const setClearWarningMessage = useWarningStore(
    (state) => state.setClearWarningMessage
  );

  const submit = useCallback(
    async (data: SignUpRequestData) => {
      setError(null);
      setClearWarningMessage(); // 警告メッセージをクリア
      if (isSubmitting) return; // すでに送信中の場合は何もしない
      setIsSubmitting(true); // 送信中フラグを立てる
      try {
        await signUpApi(data);
        return { ok: true as const };
      } catch (err: unknown) {
        // full_message は配列なので空配列を初期値にする
        let full_msg: string[] = [];
        if (isAxiosError<SignUpErrorResponse>(err)) {
          const errors = err.response?.data?.errors;
          full_msg = errors?.full_messages ?? [
            '新規登録に失敗しました。もう一度お試しください。',
          ];
          // 予期しないエラーの場合
        } else if (err instanceof Error && err.message) {
          full_msg = [err.message];
        }
        setError(full_msg);
        return { ok: false as const };
      } finally {
        setIsSubmitting(false); // 送信中フラグを下ろす
      }
    },
    [isSubmitting, setClearWarningMessage]
  );

  return { error, isSubmitting, submit };
};
