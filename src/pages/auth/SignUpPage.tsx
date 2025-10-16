import JukuCloudLogo from "@/assets/Juku-Cloud.svg";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/layout/Card/card";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useTokenConfirm } from "@/features/auth/hooks/useTokenConfirm";
import SpinnerWithText from "@/components/common/status/Loading";

export const SignUpPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { loading, tokenError, data } = useTokenConfirm(token);
  return (
    <>
      {/* API の読み込み中 */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <SpinnerWithText>Loading ...</SpinnerWithText>
        </div>
      )}
      {/* Token 関連のエラー */}
      {!loading && tokenError && <Navigate to="/404" replace />}
      {!loading && !tokenError && (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <Card className="w-full max-w-sm py-10">
            <CardHeader className="text-center">
              <Link
                to="/"
                className="flex items-center gap-2 justify-center font-medium"
              >
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                  <img
                    src={JukuCloudLogo}
                    alt="Juku Cloud Logo"
                    className="w-8 h-8"
                  />
                </div>
                Juku Cloud
              </Link>
            </CardHeader>
            <CardContent className="px-10">
              <SignUpForm token={token} data={data} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
