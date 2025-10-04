import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/navigation/Dialog/dialog";
import { Button } from "@/components/ui/form/Button/button";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import SpinnerWithText from "@/components/common/status/Loading";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import { LessonNoteForm } from "../LessonNoteForm/LessonNoteForm";
import { useLessonNoteForm } from "../../hooks/useLessonNoteForm";
import type { ClassSubjectType } from "@/features/students/types/students";
import { useCreateLessonNoteMutation } from "../../mutations/useCreateLessonNoteMutation";

export const CreateLessonNoteDialog = ({
  studentId,
  subjects,
}: {
  studentId: number;
  subjects: ClassSubjectType[];
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { value, setValue, submit, reset } = useLessonNoteForm("create");
  // mutationの実装は後で行うので仮でおいてる
  const { mutate, isPending } = useCreateLessonNoteMutation({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
  });
  useEffect(() => {
    if (!open) {
      // ダイアログを閉じたらフォームをリセット
      reset();
    }
  }, [open, reset]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">引継ぎ事項を追加</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-lg overflow-y-auto",
          isMobile
            ? "top-12 translate-y-0 max-h-[85dvh]" // モバイル: 上寄せ + 本体スクロール
            : "top-1/2 -translate-y-1/2 max-h-[90dvh]" // デスクトップ: 中央寄せ
        )}
      >
        <DialogHeader>
          <DialogTitle>引継ぎ事項を新規作成</DialogTitle>
          <DialogDescription>
            引継ぎ事項の詳細を入力してください。
          </DialogDescription>
        </DialogHeader>
        {isPending && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>引継ぎ事項を作成中...</SpinnerWithText>
          </div>
        )}
        {!isPending && (
          <LessonNoteForm
            mode="create"
            value={value}
            subjects={subjects}
            onChange={setValue}
            onSubmit={() => {
              submit(
                // zod のバリデーションを通ったら mutate を呼ぶ
                (valid) => mutate({ ...valid, student_id: studentId }),
                // zod のバリデーションに落ちたらエラーメッセージをトースト表示
                (msgs) => msgs.forEach((m) => toast.error(m))
              );
            }}
            loading={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
