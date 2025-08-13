import { useCallback, useState } from 'react';
import type { InviteTokenSuccessResponse } from '../../types/inviteToken';
import { inviteTokenApi } from '../../services/inviteTokenApi';

export const useFetchInviteToken = () => {
  const [inviteToken, setInviteToken] =
    useState<InviteTokenSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inviteTokenApi();
      setInviteToken(data);
    } catch {
      setError('予期せぬエラーが発生しました。');
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
