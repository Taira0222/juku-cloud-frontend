import { api } from '@/lib/api';
import type { SignUpRequestData, SignUpSuccessResponse } from '../types/signUp';

export const signUpApi = async (data: SignUpRequestData) => {
  const response = await api.post<SignUpSuccessResponse>('/auth', data);
  return response;
};
