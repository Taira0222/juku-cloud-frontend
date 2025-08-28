import { api } from '@/lib/api';
import type { fetchUserSuccessResponse } from '@/types/user';

export const fetchUser = async () => {
  const response = await api.get<fetchUserSuccessResponse>(
    '/auth/validate_token'
  );
  return response;
};
