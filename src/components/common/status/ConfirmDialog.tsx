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
import type { JSX } from "react";

type ConfirmDialogProps = {
  title: string;
  description: JSX.Element | string;
  confirmText: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export const ConfirmDialog = ({
  title,
  description,
  confirmText,
  open,
  onCancel,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
