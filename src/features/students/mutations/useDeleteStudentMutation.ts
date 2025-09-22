import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { studentKeys } from "../key";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { studentDelete } from "../api/studentDeleteApi";

export type DeleteStudentMutationShape = Pick<
  UseMutationResult<void, unknown, number>,
  "isPending" | "mutate"
>;

export const useDeleteStudentMutation = (
  options?: UseMutationOptions<void, unknown, number>
): DeleteStudentMutationShape => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (studentId: number) => studentDelete(studentId),
    ...options,
    onSuccess: (_void, studentId, context) => {
      // 生徒一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.removeQueries({ queryKey: studentKeys.detail(studentId) });
      toast.success("生徒を削除しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(_void, studentId, context);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
