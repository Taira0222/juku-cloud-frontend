import { useEffect, useState } from 'react';
import { tokenConfirmApi } from '../services/tokenConfirmApi';
import type {
  TokenConfirmErrorResponse,
  TokenConfirmSuccessResponse,
} from '../types/tokenConfirm';
import { isAxiosError } from 'axios';

export const useTokenConfirm = (token: string | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [data, setData] = useState<TokenConfirmSuccessResponse | null>(null);
  const DEFAULT_ERROR_MESSAGE = '予期せぬエラーが発生しました。';

  useEffect(() => {
    const confirmToken = async () => {
      try {
        setLoading(true);
        const response = await tokenConfirmApi(token);
        setData(response);
      } catch (err) {
        let errorMessage = DEFAULT_ERROR_MESSAGE;
        if (isAxiosError<TokenConfirmErrorResponse>(err)) {
          errorMessage = err.response?.data.message || DEFAULT_ERROR_MESSAGE;
        } else if (err instanceof Error && err.message) {
          errorMessage = err.message;
        }
        setTokenError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    confirmToken();
  }, [token]);

  return { loading, tokenError, data };
};
