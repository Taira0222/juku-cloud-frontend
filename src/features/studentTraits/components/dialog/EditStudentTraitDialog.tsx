import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/navigation/Dialog/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import SpinnerWithText from "@/components/common/status/Loading";
import { toast } from "sonner";
import { useUpdateStudentTraitMutation } from "../../mutations/useUpdateStudentTraitMutation";
import { useMemo } from "react";
import type { EditStudentTraitLocationState } from "../../types/studentTraitForm";
import { useStudentTraitForm } from "../../hooks/useStudentTraitForm";
import { StudentTraitForm } from "../StudentTraitForm/StudentTraitForm";

export const EditStudentTraitDialog = () => {
  // URLでDialogの開閉を制御するため、常にtrueにしておく
  const open = true;
  const { studentTraitId, studentId } = useParams<{
    studentTraitId: string;
    studentId: string;
  }>();
  const studentTraitIdNumber = Number(studentTraitId);
  const studentIdNumber = Number(studentId);
  // 整数でない、または0以下の数値なら404へリダイレクト
  if (
    !Number.isInteger(studentTraitIdNumber) ||
    !Number.isInteger(studentIdNumber) ||
    studentTraitIdNumber <= 0 ||
    studentIdNumber <= 0
  )
    return <Navigate to="/404" replace />;

  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  // --ここまでみた--
  const state: EditStudentTraitLocationState = location.state;
  const hasBackground = !!state?.background;
  // エラーハンドリングによる画面遷移
  if (!hasBackground || !state?.studentTrait) {
    return (
      <Navigate to={`/dashboard/${studentIdNumber}/student-traits`} replace />
    );
  }

  const { studentTrait } = state;

  // useLessonNoteForm の初期値をメモ化しておかないと、state 更新のたびに初期値が変わってしまう
  const initialState = useMemo(
    () => ({
      id: studentTrait.id,
      title: studentTrait.title,
      description: studentTrait.description,
      category: studentTrait.category,
    }),
    [studentTrait]
  );

  // state の処理を終わってから、初期値をセットする
  const { value, setValue, submit, reset } = useStudentTraitForm(
    "edit",
    initialState
  );
  // mutationの実装は後で行う
  const { mutate, isPending } = useUpdateStudentTraitMutation({
    onSuccess: () => {
      handleClose();
      reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "sm:max-w-lg overflow-y-auto",
          isMobile
            ? "top-12 translate-y-0 max-h-[85dvh]" // モバイル: 上寄せ + 本体スクロール
            : "top-1/2 -translate-y-1/2 max-h-[90dvh]" // デスクトップ: 中央寄せ
        )}
      >
        <DialogHeader>
          <DialogTitle>特性を編集</DialogTitle>
          <DialogDescription>特性の詳細を入力してください。</DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>特性を更新中...</SpinnerWithText>
          </div>
        )}
        {!isPending && (
          <StudentTraitForm
            mode="edit"
            value={value}
            onChange={setValue}
            onSubmit={() => {
              submit(
                // zod のバリデーションを通ったら mutate を呼ぶ
                (valid) => mutate({ ...valid, student_id: studentIdNumber }),
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
