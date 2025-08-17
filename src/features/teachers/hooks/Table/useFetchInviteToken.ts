import { useCallback, useState } from 'react';
import type {
  InviteTokenErrorResponse,
  InviteTokenSuccessResponse,
} from '@/features/teachers/types/inviteToken';
import { inviteTokenApi } from '@/features/teachers/services/inviteTokenApi';
import { isAxiosError } from 'axios';

export const useFetchInviteToken = () => {
  const [inviteToken, setInviteToken] =
    useState<InviteTokenSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inviteTokenApi();
      setInviteToken(response.data);
    } catch (err) {
      let errorMessage = DEFAULT_ERROR_MESSAGE;
      // 401,403,404 以外のエラーの場合
      if (isAxiosError<InviteTokenErrorResponse>(err)) {
        errorMessage = err.response?.data.message ?? DEFAULT_ERROR_MESSAGE;
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setInviteToken(null);
    setError(null);
  }, []);

  return { inviteToken, error, loading, refetch, reset };
};
