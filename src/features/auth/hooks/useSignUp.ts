import { signUpApi } from '../api/signUpApi';
import type {SignUpRequestData } from '../types/signUp';
import { useCallback, useState } from 'react';
import { useWarningStore } from '@/stores/warningStore';
import { getErrorMessage } from '@/lib/errors/getErrorMessage';

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
        const full_msg = getErrorMessage(err);
        setError(full_msg);
        return { ok: false as const };
      } finally {
        setIsSubmitting(false); // 送信中フラグを下ろす
      }
    },
    [isSubmitting, setClearWarningMessage]
  );

  return { isSubmitting, error, submit };
};
