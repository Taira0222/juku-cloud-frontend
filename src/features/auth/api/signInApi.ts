import { api } from '@/lib/api';
import type { SignInSuccessResponse } from '../types/auth';

export const signInApi = async (email: string, password: string) => {
  const response = await api.post<SignInSuccessResponse>(
    '/auth/sign_in',
    {
      email,
      password,
    },
    {
      suppressAuthRedirect: true,
    }
  );
  return response;
};
