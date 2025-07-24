import { CloudCog } from 'lucide-react';
import { SignInForm } from './SigninForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export const SignIn = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="flex items-center gap-2 justify-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <CloudCog className="size-4" />
            </div>
            Juku Cloud
          </Link>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};
