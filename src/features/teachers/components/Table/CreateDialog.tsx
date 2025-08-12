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

import { IconPlus } from '@tabler/icons-react';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('ここに招待URLを生成');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードAPI非対応のフォールバック
      const ta = document.createElement('textarea');
      ta.value = 'ここに招待URLを生成';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
        <DialogHeader>
          <DialogTitle>招待リンクを共有</DialogTitle>
          <DialogDescription>
            このURLを講師に送って登録してもらってください。リンクの有効期限は〇時間、1回のみ有効です
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">招待URL</label>
          <div className="flex gap-2">
            <Input value="ここに招待URLを生成" readOnly className="font-mono" />
            <Button variant="secondary" onClick={copy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            リンクをコピーしてメールやチャットで共有してください。
          </p>
        </div>

        <DialogFooter className="justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
