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

import { useDeleteStudentTraitMutation } from "../../mutations/useDeleteStudentTraitMutation";
import SpinnerWithText from "@/components/common/status/Loading";

export type DeleteStudentTraitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: number;
  studentTraitId: number;
};

export const DeleteStudentTraitDialog = ({
  open,
  onOpenChange,
  studentId,
  studentTraitId,
}: DeleteStudentTraitDialogProps) => {
  const { mutate, isPending } = useDeleteStudentTraitMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>生徒の特性を削除</AlertDialogTitle>
          <AlertDialogDescription>
            生徒の特性を削除しますか？この操作は取り消せません。
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
                  mutate({ studentId, studentTraitId });
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
