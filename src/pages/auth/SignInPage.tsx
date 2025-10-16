import JukuCloudLogo from "@/assets/Juku-Cloud.svg";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/layout/Card/card";
import { Link } from "react-router-dom";
import { SignInForm } from "@/features/auth/components/SignInForm";

export const SignInPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm py-10">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="flex items-center gap-2 justify-center font-medium"
          >
            <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <img
                src={JukuCloudLogo}
                alt="Juku Cloud Logo"
                className="size-10"
              />
            </div>
            Juku Cloud
          </Link>
        </CardHeader>
        <CardContent className="px-10">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};
