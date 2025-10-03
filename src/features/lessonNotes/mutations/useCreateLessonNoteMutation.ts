import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import type {
  LessonNoteCreateRequest,
  lessonNoteType,
} from "../types/lessonNote";
import { CreateLessonNote } from "../api/lessonNoteCreateApi";
import { lessonNoteKeys } from "../key";

export const useCreateLessonNoteMutation = (
  options?: UseMutationOptions<lessonNoteType, unknown, LessonNoteCreateRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation<lessonNoteType, unknown, LessonNoteCreateRequest>({
    mutationFn: (payload: LessonNoteCreateRequest) => CreateLessonNote(payload),
    ...options,
    onSuccess: (lessonNote, variables, context) => {
      // レッスンノート一覧のキャッシュを無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: lessonNoteKeys.lists() });
      // 詳細キャッシュは予め温めておくとUX良い
      queryClient.setQueryData(
        lessonNoteKeys.detail(lessonNote.id),
        lessonNote
      );

      toast.success("授業引継ぎを作成しました");
      // 呼び出し側で渡された onSuccess も続けて呼ぶ（合体）
      options?.onSuccess?.(lessonNote, variables, context);
    },
    onError: (error) => {
      getErrorMessage(error).forEach((msg) => toast.error(msg));
    },
  });
};
