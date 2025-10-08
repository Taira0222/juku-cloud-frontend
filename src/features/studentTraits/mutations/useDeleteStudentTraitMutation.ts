import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { studentTraitKeys } from "../key";
import type { StudentTraitDeletePayload } from "../types/studentTraits";
import { DeleteStudentTrait } from "../api/studentTraitDeleteApi";

export const useDeleteStudentTraitMutation = (
  options?: UseMutationOptions<void, unknown, StudentTraitDeletePayload>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, StudentTraitDeletePayload>({
    mutationFn: ({ studentId, studentTraitId }) =>
      DeleteStudentTrait({ studentId, studentTraitId }),
    ...options,
    onSuccess: (_void, { studentTraitId, studentId }, context) => {
      queryClient.invalidateQueries({ queryKey: studentTraitKeys.lists() });
      queryClient.removeQueries({
        queryKey: studentTraitKeys.detail(studentTraitId),
      });
      toast.success("特性を削除しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(_void, { studentTraitId, studentId }, context);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
