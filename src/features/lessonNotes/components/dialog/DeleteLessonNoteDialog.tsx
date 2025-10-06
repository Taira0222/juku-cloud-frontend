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

  if (isPending) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <SpinnerWithText className="px-3 py-2 w-full justify-center">
          削除中...
        </SpinnerWithText>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>授業引継ぎを削除</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-red-500 bg-red-50 hover:bg-red-100 focus:ring-red-500"
            onClick={() => {
              mutate({ studentId, lessonNoteId });
            }}
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
