import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { studentCreate } from "../api/studentCreateApi";
import { studentKeys } from "../key";
import type { createStudentPayload, Student } from "../types/students";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export type CreateStudentMutationResult = Pick<
  UseMutationResult<Student, unknown, createStudentPayload>,
  "mutate" | "isPending"
>;

export const useCreateStudentMutation = (
  options?: UseMutationOptions<Student, unknown, createStudentPayload>
): CreateStudentMutationResult => {
  const queryClient = useQueryClient();

  return useMutation<Student, unknown, createStudentPayload>({
    mutationFn: (payload: createStudentPayload) => studentCreate(payload),
    ...options,
    onSuccess: (student, variables, context) => {
      // 生徒一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(studentKeys.detail(student.id), student);

      toast.success("生徒を作成しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(student, variables, context);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
