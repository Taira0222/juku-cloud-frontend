import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { studentTraitKeys } from "../key";
import type {
  StudentTraitCreateRequest,
  StudentTraitType,
} from "../types/studentTraits";
import { CreateStudentTrait } from "../api/studentTraitCreateApi";

export const useCreateStudentTraitMutation = (
  options?: UseMutationOptions<
    StudentTraitType,
    unknown,
    StudentTraitCreateRequest,
    unknown
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    StudentTraitType,
    unknown,
    StudentTraitCreateRequest,
    unknown
  >({
    mutationFn: (payload: StudentTraitCreateRequest) =>
      CreateStudentTrait(payload),
    ...options,
    onSuccess: (studentTrait, variables, context, mutation) => {
      // 学生特性一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentTraitKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(
        studentTraitKeys.detail(studentTrait.id),
        studentTrait
      );

      toast.success("特性を作成しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(studentTrait, variables, context, mutation);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
