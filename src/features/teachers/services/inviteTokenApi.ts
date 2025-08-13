import { api } from '@/lib/api';
import type { InviteTokenSuccessResponse } from '../types/inviteToken';

export const inviteTokenApi = async () => {
  const response = await api.post<InviteTokenSuccessResponse>('/invites');
  return response.data;
};
