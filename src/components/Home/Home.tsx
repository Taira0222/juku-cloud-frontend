import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from './login-form';
import HomeImage from '@/assets/Home.svg';

export const Home = () => {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Juku Cloud
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* TODO::右側の細かい実装は後で実装。ISSUES#4 に記載済 */}
        <div className="bg-muted relative hidden lg:block">
          <img
            src={HomeImage}
            alt="Homeの画像"
            className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};
