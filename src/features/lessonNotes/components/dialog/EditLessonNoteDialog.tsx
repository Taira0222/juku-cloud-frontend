// この後query のリファクタリングをするため、Lintエラーになっているが了承のうえでしている
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useLessonNoteForm } from "../../hooks/useLessonNoteForm";
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
import { LessonNoteForm } from "../LessonNoteForm/LessonNoteForm";
import { toast } from "sonner";

export const EditLessonNoteDialog = () => {
  // URLでDialogの開閉を制御するため、常にtrueにしておく
  const open = true;
  const { lessonNoteId, studentId } = useParams<{
    lessonNoteId: string;
    studentId: string;
  }>();
  const lessonNoteIdNumber = Number(lessonNoteId);
  const studentIdNumber = Number(studentId);
  // 整数でない、または0以下の数値なら404へリダイレクト
  if (
    !Number.isInteger(lessonNoteIdNumber) ||
    !Number.isInteger(studentIdNumber) ||
    lessonNoteIdNumber <= 0 ||
    studentIdNumber <= 0
  )
    return <Navigate to="/404" replace />;

  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };
  const state = location.state;
  const hasBackground = !!state?.background;
  // エラーハンドリングによる画面遷移
  if (!hasBackground) {
    return <Navigate to={`/dashboard/${studentIdNumber}`} replace />;
  }
  // state を取得、なければquery で呼び出す予定

  // state の処理を終わってから、初期値をセットする
  const { value, setValue, submit, reset } = useLessonNoteForm("edit");
  // mutationの実装は後で行う
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
          <DialogTitle>引継ぎ事項を編集</DialogTitle>
          <DialogDescription>
            引継ぎ事項の詳細を入力してください。
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>引継ぎ事項を更新中...</SpinnerWithText>
          </div>
        )}
        {!isPending && (
          <LessonNoteForm
            mode="edit"
            value={value}
            // subjects は state から取得だけど、queryの実装が終わってから挿入する
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
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
