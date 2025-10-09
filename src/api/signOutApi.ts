import { api } from "@/lib/api";

export const signOutApi = async () => {
  const { data } = await api.delete("/auth/sign_out");
  return data;
};
