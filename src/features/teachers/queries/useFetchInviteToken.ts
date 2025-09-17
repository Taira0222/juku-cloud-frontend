import { useCallback, useState } from "react";
import type { InviteTokenSuccessResponse } from "@/features/teachers/types/inviteToken";
import { inviteTokenApi } from "@/features/teachers/api/inviteTokenApi";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export const useFetchInviteToken = () => {
  const [inviteToken, setInviteToken] =
    useState<InviteTokenSuccessResponse | null>(null);
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inviteTokenApi();
      setInviteToken(response.data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
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
