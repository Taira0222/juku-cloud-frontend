import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { studentCreate } from "../api/studentCreateApi";
import { studentKeys } from "../../key";
import type { createStudentPayload, Student } from "../types/students";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export const useCreateStudentMutation = (
  options?: UseMutationOptions<Student, unknown, createStudentPayload, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation<Student, unknown, createStudentPayload, unknown>({
    mutationFn: (payload: createStudentPayload) => studentCreate(payload),
    ...options,
    onSuccess: (student, variables, context, mutation) => {
      // 生徒一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(studentKeys.detail(student.id), student);

      toast.success("生徒を作成しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(student, variables, context, mutation);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
