import { ArrowRight, Users, BookOpen, Award, CloudCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactImage from '@/assets/react.svg';
import { Button } from '@/components/ui/form/Button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/Card/card';

export const Home = () => {
  return (
    <>
      <div className="min-h-svh">
        {/* Header */}
        <div className="flex justify-center p-6 md:p-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <CloudCog className="size-4" />
            </div>
            Juku Cloud
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center space-y-12 px-6 py-8 md:px-10 md:py-16">
          {/* Hero Section */}
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              学習管理を
              <span className="text-primary">クラウド</span>で
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              塾・教育機関向けの包括的な学習管理システム。
              生徒の進捗管理から成績分析まで、教育をサポートします。
            </p>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-2xl">
            <img
              src={ReactImage}
              alt="Juku Cloud - 学習管理システム"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Features */}
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-8">主な機能</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader className="pb-4">
                  <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">生徒管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    生徒情報の一元管理で、個々の学習状況を詳細に把握できます。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-4">
                  <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">学習追跡</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    進捗と成績の可視化により、学習効果を最大化します。
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-4">
                  <Award className="mx-auto h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">成績分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    詳細な分析レポートで、指導方針の最適化をサポートします。
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-8 max-w-md w-full">
            <h2 className="text-2xl font-bold">今すぐ始めよう</h2>

            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="w-full">
                <Link
                  to="/sign_in"
                  className="flex items-center justify-center gap-2"
                >
                  ログイン
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full">
                <Link
                  to="/sign_up"
                  className="flex items-center justify-center gap-2"
                >
                  新規登録
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は{' '}
              <Link
                to="/sign_in"
                className="text-primary hover:underline font-medium"
              >
                こちらからログイン
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/30 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Juku Cloud. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};
