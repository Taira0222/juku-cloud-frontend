import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { studentTraitKeys } from "../key";
import type {
  StudentTraitType,
  StudentTraitUpdateRequest,
} from "../types/studentTraits";
import { UpdateStudentTrait } from "../api/studentTraitUpdate";

export const useUpdateStudentTraitMutation = (
  options?: UseMutationOptions<
    StudentTraitType,
    unknown,
    StudentTraitUpdateRequest,
    unknown
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    StudentTraitType,
    unknown,
    StudentTraitUpdateRequest,
    unknown
  >({
    mutationFn: (payload: StudentTraitUpdateRequest) =>
      UpdateStudentTrait(payload),
    ...options,
    onSuccess: (studentTrait, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: studentTraitKeys.lists() });
      queryClient.setQueryData(
        studentTraitKeys.detail(studentTrait.id),
        studentTrait
      );

      toast.success("特性を更新しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(studentTrait, variables, context, mutation);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
