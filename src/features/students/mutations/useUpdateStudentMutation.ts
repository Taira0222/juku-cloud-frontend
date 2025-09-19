import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { studentKeys } from "../key";
import type {
  updateStudentPayload,
  updateStudentResponseSchema,
} from "../types/students";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import type z from "zod";
import { studentUpdateApi } from "../api/studentUpdateApi";

type updateStudentResponse = z.infer<typeof updateStudentResponseSchema>;

export const useUpdateStudentMutation = (
  options?: UseMutationOptions<
    updateStudentResponse,
    unknown,
    updateStudentPayload
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<updateStudentResponse, Error, updateStudentPayload>({
    mutationFn: (payload: updateStudentPayload) => studentUpdateApi(payload),
    ...options,
    onSuccess: (student, variables, context) => {
      // 生徒一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(studentKeys.detail(student.id), student);

      toast.success("生徒を更新しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(student, variables, context);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
