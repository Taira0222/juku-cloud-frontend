import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/navigation/Dialog/dialog";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTeachersStore } from "@/stores/teachersStore";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import SpinnerWithText from "@/components/common/status/Loading";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import { TeacherForm } from "../TeacherForm/TeacherForm";
import { useTeacherForm } from "../../hooks/useTeacherForm";
import { useTeacherSubmit } from "../../hooks/useTeacherSubmit";

export const EditTeacherDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const { id } = useParams<{ id: string }>();
  const detailDrawer = useTeachersStore((state) => state.detailDrawer);

  const isMobile = useIsMobile();

  const teacherId = id ? parseInt(id, 10) : 0;
  const teacher = detailDrawer.find((t) => t.id === teacherId);

  // エラーハンドリングによる画面遷移
  if (state?.background === undefined) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  if (!teacher) {
    return <Navigate to="/teachers" state={{ from: location }} replace />;
  }

  const { formData, setFormData } = useTeacherForm(teacher);

  const handleClose = () => {
    navigate(-1);
  };

  const { handleSubmit, loading, error } = useTeacherSubmit({
    formData,
    teacherId,
    handleClose,
  });

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()} // iOS safariのフォーカスずれ防止
        className={cn(
          "sm:max-w-lg overflow-y-auto",
          isMobile
            ? "top-12 translate-y-0 max-h-[85dvh]" // モバイル: 上寄せ + 本体スクロール
            : "top-1/2 -translate-y-1/2 max-h-[90dvh]" // デスクトップ: 中央寄せ
        )}
      >
        <DialogHeader>
          <DialogTitle>講師を編集</DialogTitle>
          <div className="text-muted-foreground leading-7">
            {loading && "読み込み中"}
            {!loading && (
              <span>講師「{teacher?.name}」の情報を編集します。</span>
            )}
          </div>
          <DialogDescription>講師の基本情報を変更できます。</DialogDescription>
        </DialogHeader>
        {/* API の読み込み中 */}
        {loading && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>Loading...</SpinnerWithText>
          </div>
        )}
        <ErrorDisplay error={error} />

        {/* 正常時のレンダリング */}
        {!loading && (
          <TeacherForm
            formData={formData}
            setFormData={setFormData}
            handleClose={handleClose}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
