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
import { useState } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  teacherName: string;
  teacherRole: string;
};

export const DeleteTeacherDialog = ({
  open,
  onOpenChange,
  teacherId,
  teacherName,
  teacherRole,
}: Props) => {
  const [confirmText, setConfirmText] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="p-6 sm:p-7 space-y-5">
          <DialogHeader>
            <DialogTitle>講師を削除しますか？</DialogTitle>

            {/* 危険文をアラート化して強調だけに集中 */}
            <div className="text-muted-foreground leading-7">
              <span>
                講師 <span className="font-semibold">「{teacherName}」</span>{' '}
                を削除します。{teacherId} {teacherRole}
              </span>
            </div>

            {/* 本文は淡色＋行間広め＋箇条書きで圧縮 */}
            <DialogDescription asChild>
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
            </DialogDescription>
          </DialogHeader>

          {/* 入力セクション */}
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
              aria-label="講師を削除する"
              onClick={() => {}}
            >
              講師を削除する
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
