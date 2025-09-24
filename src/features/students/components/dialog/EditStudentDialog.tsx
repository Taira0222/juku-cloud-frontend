import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/navigation/Dialog/dialog";
import { StudentForm } from "../StudentForm/StudentForm";
import { useStudentForm } from "../../hooks/useStudentForm";
import { useTeachersForStudent } from "../../hooks/useTeachersForStudent";
import { toast } from "sonner";
import SpinnerWithText from "@/components/common/status/Loading";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useStudentForEdit } from "../../hooks/useStudentForEdit";
import { studentFormatForEdit } from "../../utils/studentFormatForEdit";
import { useUpdateStudentMutation } from "../../mutations/useUpdateStudentMutation";

export const EditStudentDialog = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = id ? parseInt(id, 10) : 0;
  const location = useLocation();
  const state = location.state;
  const hasBackground = !!state?.background;

  // エラーハンドリングによる画面遷移
  if (!hasBackground) {
    return <Navigate to="/students" replace />;
  }

  const { student, isNotFound, isLoading } = useStudentForEdit(
    studentId,
    state
  );
  // student の取得中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <SpinnerWithText>生徒情報を読み込み中...</SpinnerWithText>
      </div>
    );
  }

  // 取得処理完了済みだが、該当IDの生徒が存在しない場合
  if (isNotFound) {
    return <Navigate to="/404" replace />;
  }

  // ここまでくれば student は確実に存在する
  const formattedStudent = useMemo(() => {
    return student ? studentFormatForEdit(student) : undefined;
  }, [student]);

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  const { value, setValue, submit, reset } = useStudentForm(
    "edit",
    formattedStudent
  );
  // URLでDialogの開閉を制御するため、常にtrueにしておく
  const open = true;
  const { loading, error, teachers } = useTeachersForStudent(open);
  // のちに更新用のmutationに差し替える
  const { mutate, isPending } = useUpdateStudentMutation({
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
          <DialogTitle>生徒情報を編集</DialogTitle>
          <DialogDescription>
            生徒の基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>講師情報を読み込み中...</SpinnerWithText>
          </div>
        )}
        {isPending && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>生徒情報を更新中...</SpinnerWithText>
          </div>
        )}
        <ErrorDisplay error={error} />
        {!loading && !error && !isPending && (
          <StudentForm
            mode="edit"
            value={value}
            onChange={setValue}
            onSubmit={() => {
              submit(
                // zod のバリデーションを通ったら mutate を呼ぶ
                (valid) => mutate(valid),
                // zod のバリデーションに落ちたらエラーメッセージをトースト表示
                (msgs) => msgs.forEach((m) => toast.error(m))
              );
            }}
            loading={isPending}
            teachers={teachers}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
