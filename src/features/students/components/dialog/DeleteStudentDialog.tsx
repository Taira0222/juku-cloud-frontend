import { Button } from "@/components/ui/form/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/navigation/Dialog/dialog";
import { Input } from "@/components/ui/form/Input/input";
import { Label } from "@/components/ui/form/Label/label";
import { useEffect, useState } from "react";
import SpinnerWithText from "@/components/common/status/Loading";
import { cn } from "@/lib/utils";
import type { Student } from "../../types/students";
import { useDeleteStudentMutation } from "../../mutations/useDeleteStudentMutation";
import { Navigate } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
};

export const DeleteStudentDialog = ({ open, onOpenChange, student }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteStudentMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });
  // 更新ボタンなどでstudent が null になる可能性があるのでガード
  if (!student) {
    return <Navigate to="/students" replace={true} />;
  }

  // 開くたびに入力とエラーを初期化
  useEffect(() => {
    if (open) {
      setConfirmText("");
      setWarning(null);
    }
  }, [open]);

  const onClickDelete = async () => {
    // 文字が一致しているか確認
    if (confirmText !== student?.name) {
      setWarning("名前が一致しません。");
      return;
    }

    setConfirmText("");
    setWarning(null);

    mutate(student.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="p-6 sm:p-7 space-y-5">
          <DialogHeader>
            <DialogTitle>
              {isPending && "読み込み中"}
              {!isPending && "講師を削除しますか？"}
            </DialogTitle>

            <div className="text-muted-foreground leading-7">
              <span>
                講師 <span className="font-semibold">「{student.name}」</span>
                を削除します。
              </span>
            </div>

            <DialogDescription asChild>
              {isPending ? (
                <span className="sr-only">削除確認ダイアログの読み込み中</span>
              ) : (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <ul className="list-disc bg-red-50 pl-5 mt-2 space-y-1 text-left">
                    <li>この操作は取り消せません。</li>
                    <li>
                      削除後は講師のデータは完全に失われますのでご注意ください
                    </li>
                    <li>担当割当などの関連は解除されます</li>
                    <li>削除する場合は「{student.name}」と入力してください</li>
                  </ul>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {/* API の読み込み中 */}
          {isPending && (
            <div className="flex items-center justify-center h-32">
              <SpinnerWithText>Loading...</SpinnerWithText>
            </div>
          )}
          {/* 正常時のレンダリング */}
          {!isPending && (
            <>
              {warning && <div className="text-sm text-red-500">{warning}</div>}

              <section className="space-y-2">
                <Label htmlFor="confirmStudentName">確認入力</Label>
                <Input
                  id="confirmStudentName"
                  placeholder={student.name}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.currentTarget.value)}
                />
              </section>

              <DialogFooter className="mt-2 gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  aria-label="キャンセル"
                  onClick={() => onOpenChange(false)}
                >
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={onClickDelete}
                  aria-label={`生徒「${student.name}」を削除する`}
                  disabled={isPending}
                  className={cn({ "opacity-50": isPending })}
                >
                  {isPending ? "読み込み中..." : "生徒を削除する"}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
