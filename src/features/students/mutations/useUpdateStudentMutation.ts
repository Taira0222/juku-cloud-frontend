import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { studentKeys } from "../../key";
import type { editStudentPayload, Student } from "../types/students";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { studentUpdate } from "../api/studentUpdateApi";

export const useUpdateStudentMutation = (
  options?: UseMutationOptions<Student, unknown, editStudentPayload, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation<Student, unknown, editStudentPayload, unknown>({
    mutationFn: (payload: editStudentPayload) => studentUpdate(payload),
    ...options,
    onSuccess: (student, variables, context, mutation) => {
      // 生徒一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(studentKeys.detail(student.id), student);

      toast.success("生徒を更新しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(student, variables, context, mutation);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
