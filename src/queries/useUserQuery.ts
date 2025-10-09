import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/userApi";
import type { fetchUserSuccessResponse } from "@/types/user";
import type { User } from "@/stores/userStore";

type Opts = { enabled?: boolean };
export const useUserQuery = (opts?: Opts) =>
  useQuery<fetchUserSuccessResponse, unknown, User>({
    queryKey: ["currentUser"],
    queryFn: () => fetchUser(),
    placeholderData: keepPreviousData,
    select: (data): User => ({
      id: data.data.id,
      name: data.data.name,
      email: data.data.email,
      role: data.data.role,
      school: data.data.school.name,
    }),
    ...opts,
  });
