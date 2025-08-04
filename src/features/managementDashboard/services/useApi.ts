import { api } from '@/lib/api';

export const fetchUser = async () => {
  const response = await api.get('/auth/validate_token');
  return response;
};
