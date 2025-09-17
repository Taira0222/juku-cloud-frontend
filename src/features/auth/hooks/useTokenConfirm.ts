import { useEffect, useState } from 'react';
import { tokenConfirmApi } from '../api/tokenConfirmApi';
import type {
  TokenConfirmSuccessResponse,
} from '../types/tokenConfirm';
import { getErrorMessage } from '@/lib/errors/getErrorMessage';

export const useTokenConfirm = (token: string | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string[] | null>(null);
  const [data, setData] = useState<TokenConfirmSuccessResponse | null>(null);

  useEffect(() => {
    const confirmToken = async () => {
      try {
        setLoading(true);
        const response = await tokenConfirmApi(token);
        setData(response.data);
      } catch (err) {
        const errorMessage = getErrorMessage(err)
        setTokenError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    confirmToken();
  }, [token]);

  return { loading, tokenError, data };
};
