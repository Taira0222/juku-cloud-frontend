import { api } from '@/lib/api';
import type { TokenConfirmSuccessResponse } from '../types/tokenConfirm';

export const tokenConfirmApi = async (token: string | null) => {
  const response = await api.get<TokenConfirmSuccessResponse>(
    `/invites/${token}`
  );
  return response;
};
