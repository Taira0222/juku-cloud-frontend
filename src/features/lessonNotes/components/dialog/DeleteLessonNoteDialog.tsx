import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/feedback/Alert/alert-dialog";

import { useDeleteLessonNoteMutation } from "../../mutations/useDeleteLessonNoteMutation";
import SpinnerWithText from "@/components/common/status/Loading";

export type DeleteLessonNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: number;
  lessonNoteId: number;
};

export const DeleteLessonNoteDialog = ({
  open,
  onOpenChange,
  studentId,
  lessonNoteId,
}: DeleteLessonNoteDialogProps) => {
  const { mutate, isPending } = useDeleteLessonNoteMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>授業引継ぎを削除</AlertDialogTitle>
          <AlertDialogDescription>
            授業引継ぎを削除しますか？この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isPending ? (
          <SpinnerWithText className="px-3 py-2 w-full justify-center">
            削除中...
          </SpinnerWithText>
        ) : (
          <>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                className="text-red-500 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                disabled={isPending}
                onClick={() => {
                  mutate({ studentId, lessonNoteId });
                }}
              >
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
