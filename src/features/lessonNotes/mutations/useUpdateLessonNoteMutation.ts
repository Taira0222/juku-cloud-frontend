import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import type {
  lessonNoteType,
  LessonNoteUpdateRequest,
} from "../types/lessonNote";
import { lessonNoteKeys } from "../key";
import { UpdateLessonNote } from "../api/lessonNoteUpdateApi";

export const useUpdateLessonNoteMutation = (
  options?: UseMutationOptions<
    lessonNoteType,
    unknown,
    LessonNoteUpdateRequest,
    unknown
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<lessonNoteType, unknown, LessonNoteUpdateRequest, unknown>(
    {
      mutationFn: (payload: LessonNoteUpdateRequest) =>
        UpdateLessonNote(payload),
      ...options,
      onSuccess: (lessonNote, variables, context, mutation) => {
        // 引継ぎ事項のキャッシュを無効化して再フェッチ
        queryClient.invalidateQueries({ queryKey: lessonNoteKeys.lists() });
        // 詳細キャッシュは予め温めておくとUX良い
        queryClient.setQueryData(
          lessonNoteKeys.detail(lessonNote.id),
          lessonNote
        );

        toast.success("引継ぎ事項を更新しました");
        // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
        options?.onSuccess?.(lessonNote, variables, context, mutation);
      },
      onError: (error) => {
        getErrorMessage(error).forEach((msg) => toast.error(msg));
      },
    }
  );
};
