import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/navigation/Dialog/dialog';
import { Button } from '@/components/ui/form/Button/button';
import { IconPlus } from '@tabler/icons-react';
import StudentForm from '../StudentForm/StudentForm';
import { useStudentForm } from '../../hooks/useStudentForm';
import { useTeachersForStudent } from '../../hooks/useTeachersForStudent';
import { useCreateStudentMutation } from '../../mutations/useCreateStudentMutation';
import { toast } from 'sonner';
import SpinnerWithText from '@/components/common/status/Loading';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMobile';

export const CreateStudentDialog = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { value, setValue, submit, reset } = useStudentForm('create');
  const { loading, error, teachers } = useTeachersForStudent(open);
  const { mutate, isPending } = useCreateStudentMutation({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">生徒の追加</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'sm:max-w-lg overflow-y-auto',
          isMobile
            ? 'top-12 translate-y-0 max-h-[85dvh]' // モバイル: 上寄せ + 本体スクロール
            : 'top-1/2 -translate-y-1/2 max-h-[90dvh]' // デスクトップ: 中央寄せ
        )}
      >
        <DialogHeader>
          <DialogTitle>生徒を新規作成</DialogTitle>
          <DialogDescription>
            生徒の基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center h-32">
            講師情報を読み込み中...
          </div>
        )}
        {isPending && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>生徒情報を作成中...</SpinnerWithText>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && !isPending && (
          <StudentForm
            mode="create"
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
