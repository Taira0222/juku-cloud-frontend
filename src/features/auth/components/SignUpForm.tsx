import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/form/Button/button";
import { Input } from "@/components/ui/form/Input/input";
import { Label } from "@/components/ui/form/Label/label";
import { useState, type ComponentProps, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useWarningStore } from "@/stores/warningStore";
import { useSignUp } from "../hooks/useSignUp";
import type { TokenConfirmSuccessResponse } from "../types/tokenConfirm";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";

type SignUpFormProps = ComponentProps<"form"> & {
  token: string | null;
  data: TokenConfirmSuccessResponse | null;
};

export function SignUpForm({ token, data }: SignUpFormProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // パスワード表示/非表示
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false); // 確認用パスワード表示/非表示
  const navigate = useNavigate();
  const warningMessage = useWarningStore((state) => state.warningMessage);
  const { isSubmitting, error, submit } = useSignUp();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const requestData = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      token: token,
    };
    const result = await submit(requestData);

    if (result?.ok) {
      navigate("/sign_up/confirmation_sent", {
        replace: true,
        state: { from: "/sign_up" },
      });
    } else {
      setPassword("");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center ">
        <h1 className="text-2xl font-bold">アカウントを新規作成</h1>
        <h2 className="text-muted-foreground text-sm">
          {data?.school_name}へようこそ
        </h2>
        <p className="text-muted-foreground text-sm text-balance">
          名前とメールアドレスを入力してください
        </p>
      </div>

      {/* エラーメッセージの表示 */}
      {warningMessage && (
        <p className="text-red-500 text-center">{warningMessage}</p>
      )}
      <ErrorDisplay
        error={error}
        className="text-center text-sm"
        childClassName="mb-1 last:mb-0"
      />

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="山田 太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 relative">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="grid gap-3 relative">
          <Label htmlFor="password_confirmation">パスワード確認</Label>
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type={showPasswordConfirmation ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9"
            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            aria-label={
              showPasswordConfirmation
                ? "パスワード確認を隠す"
                : "パスワード確認を表示"
            }
          >
            {showPasswordConfirmation ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          className={cn("w-full", {
            "opacity-50 cursor-not-allowed": isSubmitting,
          })}
          disabled={isSubmitting}
        >
          {isSubmitting ? "登録中..." : "新規登録"}
        </Button>
      </div>

      <div className="text-center text-sm">
        すでにアカウントをお持ちですか？{" "}
        <Link to="/sign_in" className="underline underline-offset-4">
          ログイン
        </Link>
      </div>
    </form>
  );
}
