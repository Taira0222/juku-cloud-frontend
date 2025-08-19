import { Button } from '@/components/ui/form/Button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/navigation/Dialog/dialog';
import { Input } from '@/components/ui/form/Input/input';
import { Label } from '@/components/ui/form/Label/label';
import { useEffect, useState } from 'react';
import { useTeacherDelete } from '../../hooks/Table/useTeacherDelete';
import { toast } from 'sonner';
import SpinnerWithText from '@/components/common/status/Loading';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  teacherName: string;
  refetch: () => Promise<void>;
};

export const DeleteTeacherDialog = ({
  open,
  onOpenChange,
  teacherId,
  teacherName,
  refetch,
}: Props) => {
  const [confirmText, setConfirmText] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const { error, loading, deleteTeacher } = useTeacherDelete();

  // 開くたびに入力とエラーを初期化
  useEffect(() => {
    if (open) {
      setConfirmText('');
      setWarning(null);
    }
  }, [open]);

  const onClickDelete = async () => {
    // 文字が一致しているか確認
    if (confirmText !== teacherName) {
      setWarning('名前が一致しません。');
      return;
    }

    setConfirmText('');
    setWarning(null);

    const result = await deleteTeacher(teacherId);
    if (result.ok) {
      onOpenChange(false); // Dialog を閉じる
      setConfirmText(''); // 入力フィールドをクリア
      toast.success('講師を削除しました。', {
        className: 'bg-green-100 text-green-800 border border-green-300',
      });
      await refetch(); // データを再取得して最新の状態に更新
    } else {
      // 削除失敗時の処理
      toast.error('講師の削除に失敗しました。', {
        className: 'bg-red-100 text-red-800 border border-red-300',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="p-6 sm:p-7 space-y-5">
          <DialogHeader>
            <DialogTitle>
              {loading && '読み込み中'}
              {!loading && '講師を削除しますか？'}
            </DialogTitle>

            <div className="text-muted-foreground leading-7">
              <span>
                講師 <span className="font-semibold">「{teacherName}」</span>{' '}
                を削除します。
              </span>
            </div>

            <DialogDescription asChild>
              {!loading && !error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <ul className="list-disc bg-red-50 pl-5 mt-2 space-y-1 text-left">
                    <li>この操作は取り消せません。</li>
                    <li>
                      削除後は講師のデータは完全に失われますのでご注意ください
                    </li>
                    <li>担当割当などの関連は解除されます</li>
                    <li>削除する場合は「{teacherName}」と入力してください</li>
                  </ul>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {/* API の読み込み中 */}
          {loading && (
            <div className="flex items-center justify-center h-32">
              <SpinnerWithText>Loading...</SpinnerWithText>
            </div>
          )}
          {/* 正常時のレンダリング */}
          {!loading && (
            <>
              {warning && <div className="text-sm text-red-500">{warning}</div>}
              {error && <div className="text-sm text-red-500">{error}</div>}

              <section className="space-y-2">
                <Label htmlFor="confirmTeacherName">確認入力</Label>
                <Input
                  id="confirmTeacherName"
                  placeholder={teacherName}
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
                  aria-label={`講師「${teacherName}」を削除する`}
                  disabled={loading}
                  className={cn({ 'opacity-50': loading })}
                >
                  {loading ? '読み込み中...' : '講師を削除する'}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
