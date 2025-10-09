import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { signOutApi } from "@/api/signOutApi";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setSignOutInProgress = useAuthStore(
    (state) => state.setSignOutInProgress
  );

  return useMutation<void, unknown, void, unknown>({
    onMutate: async () => {
      setSignOutInProgress(true);
      await queryClient.cancelQueries();
      queryClient.clear();
    },
    mutationFn: () => signOutApi(),
    onSuccess: async () => {
      clearUser();
      clearAuth();
      toast.success("ログアウトしました");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
