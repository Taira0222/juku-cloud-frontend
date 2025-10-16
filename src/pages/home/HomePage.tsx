import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppScreen from "@/assets/AppScreen.svg";
import JukuCloudLogo from "@/assets/Juku-Cloud.svg";
import { Button } from "@/components/ui/form/Button/button";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export const Home = () => {
  const setSignOutInProgress = useAuthStore(
    (state) => state.setSignOutInProgress
  );

  useEffect(() => {
    setSignOutInProgress(false);
  }, [setSignOutInProgress]);

  return (
    <>
      <div className="min-h-svh bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="flex justify-center p-6 md:p-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <img src={JukuCloudLogo} alt="Juku Cloud Logo" />
            </div>
            JukuCloud
          </Link>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-6xl px-6 md:px-10 py-8 space-y-10">
          {/* Hero: 2カラムにして重心を作る */}
          <section className="grid items-center gap-20 md:grid-cols-2">
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                生徒一人ひとりの特性を
                <br className="hidden sm:block" />
                クラウドで見える化
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                生徒情報・講師管理・特性管理・授業の引継までワンストップ。
                <br />
                「探す・集計・伝える」にかける時間を、指導に還元できます。
              </p>

              <div className="mt-8 flex justify-center md:justify-end">
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 bg-primary text-white font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Link
                    to="/sign_in"
                    className="flex items-center justify-center gap-2"
                  >
                    ログイン
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <img
              src={AppScreen}
              alt="Juku Cloud の管理画面（生徒一覧）"
              className="w-full h-auto rounded-b-xl"
              loading="eager"
              decoding="async"
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-6">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="text-center text-sm text-muted-foreground">
              © 2025 Juku Cloud. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
