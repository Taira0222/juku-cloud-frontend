import { Button } from "@/components/ui/form/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/navigation/Dialog/dialog";
import { Input } from "@/components/ui/form/Input/input";
import SpinnerWithText from "@/components/common/status/Loading";

import { IconPlus } from "@tabler/icons-react";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/form/Label/label";
import { useFetchInviteToken } from "../../queries/useFetchInviteToken";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";

export const CreateDialog = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const { inviteToken, error, loading, refetch, reset } = useFetchInviteToken();
  const inviteUrl = inviteToken
    ? `${import.meta.env.VITE_FRONTEND_BASE_URL}/sign_up?token=${
        inviteToken.token
      }`
    : "";

  useEffect(() => {
    if (open) {
      refetch();
      setCopyError(null);
      setCopied(false);
    } else {
      reset();
    }
  }, [open, refetch, reset]);

  const copy = async () => {
    if (!inviteUrl) return;
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("コピーに失敗しました。");
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
          <DialogTitle>
            {loading && "読み込み中"}
            {!loading && error && "エラー"}
            {!loading && !error && "招待リンクを共有"}
          </DialogTitle>
          <DialogDescription>
            {loading && "データを読み込んでいます…"}
            {!loading &&
              error &&
              "エラーが発生しました。内容を確認してください。"}
            {!loading &&
              !error &&
              "このURLを講師に送って登録してもらってください。リンクの有効期限は7日間、1回のみ有効です"}
          </DialogDescription>
        </DialogHeader>
        {/* API の読み込み中 */}
        {loading && (
          <div className="flex items-center justify-center h-32">
            <SpinnerWithText>Loading...</SpinnerWithText>
          </div>
        )}
        {/* エラーメッセージの表示 */}
        {!loading && error && <ErrorDisplay error={error} />}
        {/* 正常時のレンダリング */}
        {!loading && !error && (
          <>
            <div className="space-y-3">
              <Label htmlFor="inviteUrl">招待URL</Label>
              <div className="flex gap-2">
                <Input
                  // test で input を探すために(htmlFor と id が同じ必要あり)
                  id="inviteUrl"
                  value={inviteUrl}
                  readOnly
                  className="font-mono"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <Button variant="secondary" aria-label="コピー" onClick={copy}>
                  {copied ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600">コピーしました。</p>
              )}
              {copyError && <p className="text-xs text-red-500">{copyError}</p>}
              <p className="text-sm text-muted-foreground">
                ※同じリンク（トークン）を複数の講師に送らないでください。1人の講師につき1つのリンクを送信してください。
              </p>
            </div>

            <DialogFooter className="justify-between">
              <Button
                variant="outline"
                aria-label="閉じる"
                onClick={() => setOpen(false)}
              >
                閉じる
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
