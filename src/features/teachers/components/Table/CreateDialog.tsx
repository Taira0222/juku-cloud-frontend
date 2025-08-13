import { Button } from '@/components/ui/form/Button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/navigation/Dialog/dialog';
import { Input } from '@/components/ui/form/Input/input';
import SpinnerWithText from '@/components/common/status/Loading';

import { IconPlus } from '@tabler/icons-react';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFetchInviteToken } from '../../hooks/Table/useFetchInviteToken';

export const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { inviteToken, error, loading, refetch, reset } = useFetchInviteToken();
  const inviteUrl = inviteToken
    ? `${import.meta.env.VITE_FRONTEND_BASE_URL}/sign_up?token=${
        inviteToken.token
      }`
    : '';

  useEffect(() => {
    if (open) {
      refetch(); // 開いたら毎回取り直す
    } else {
      reset(); // 閉じたら消す（漏れ防止）
    }
  }, [open, refetch, reset]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(
        'お使いの環境では自動コピーできません。URLを手動でコピーしてください。'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">講師の追加</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>Loading...</SpinnerWithText>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>招待リンクを共有</DialogTitle>
              <DialogDescription>
                このURLを講師に送って登録してもらってください。リンクの有効期限は7日間、1回のみ有効です
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">招待URL</label>
              <div className="flex gap-2">
                <Input value={inviteUrl} readOnly className="font-mono" />
                <Button variant="secondary" onClick={copy}>
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                ※1講師あたり1つのリンクを送信するようにしてください。
              </p>
            </div>

            <DialogFooter className="justify-between">
              <Button variant="outline" onClick={() => setOpen(false)}>
                閉じる
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
