import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import type { LessonNoteDeletePayload } from "../types/lessonNote";
import { DeleteLessonNote } from "../api/lessonNoteDeleteApi";
import { lessonNoteKeys } from "../key";

export const useDeleteLessonNoteMutation = (
  options?: UseMutationOptions<void, unknown, LessonNoteDeletePayload, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, LessonNoteDeletePayload, unknown>({
    mutationFn: ({ studentId, lessonNoteId }) =>
      DeleteLessonNote({ studentId, lessonNoteId }),
    ...options,
    onSuccess: (_void, { lessonNoteId, studentId }, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: lessonNoteKeys.lists() });
      queryClient.removeQueries({
        queryKey: lessonNoteKeys.detail(lessonNoteId),
      });
      toast.success("授業引継ぎを削除しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(
        _void,
        { lessonNoteId, studentId },
        context,
        mutation
      );
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
