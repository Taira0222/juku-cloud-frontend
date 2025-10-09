import { api } from "@/lib/api";

export const fetchUser = async () => {
  const { data } = await api.get("/auth/validate_token");
  return data;
};
