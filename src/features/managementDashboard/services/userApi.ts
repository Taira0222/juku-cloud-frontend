import { api } from '@/lib/api';
import type { fetchUserResponse } from '../types/user';

export const fetchUser = async () => {
  const response = await api.get<fetchUserResponse>('/auth/validate_token');
  return response;
};
