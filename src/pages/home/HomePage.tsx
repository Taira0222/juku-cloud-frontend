import { ArrowRight, CloudCog } from "lucide-react";
import { Link } from "react-router-dom";
import AppScreen from "@/assets/AppScreen.png";
import { Button } from "@/components/ui/form/Button/button";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export const Home = () => {
  const setSignOutInProgress = useAuthStore((s) => s.setSignOutInProgress);

  useEffect(() => {
    setSignOutInProgress(false);
  }, [setSignOutInProgress]);

  return (
    <>
      <div className="min-h-svh bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="flex justify-center p-6 md:p-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <CloudCog className="size-4" />
            </div>
            JukuCloud
          </Link>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-6xl px-6 md:px-10 py-8 space-y-10">
          {/* Hero: 2カラムにして重心を作る */}
          <section className="grid items-center gap-14 md:grid-cols-2">
            {/* App Screenshot（ブラウザ枠付き） */}
            <div className="rounded-xl border bg-background/60 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/40">
              <div className="flex items-center gap-1 px-3 py-2 border-b">
                <span className="size-2 rounded-full bg-red-400" />
                <span className="size-2 rounded-full bg-yellow-400" />
                <span className="size-2 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground">
                  JukuCloud.com
                </span>
              </div>
              <img
                src={AppScreen}
                alt="Juku Cloud の管理画面（生徒一覧）"
                className="w-full h-auto rounded-b-xl"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                学習管理を<span className="text-primary">クラウド</span>で、
                <br className="hidden sm:block" />
                効率的な指導を実現
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                生徒情報・講師管理・特性管理・引継ぎノートまでワンストップ。
                <br />
                「探す・集計・伝える」にかける時間を、指導に還元できます。
              </p>

              <div className="mt-8 flex md:justify-start">
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
