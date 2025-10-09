import { Home } from "@/pages/home/HomePage";

import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { SignInPage } from "@/pages/auth/SignInPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { ConfirmationSent } from "@/pages/confirm/ConfirmationSentPage";
import { ConfirmedPage } from "@/pages/confirm/ConfirmedPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { AuthRoute } from "./AuthRoute";

import { ForbiddenPage } from "@/pages/error/ForbiddenPage";
import { ProtectedArea } from "./ProtectedArea";
import { InternalServerErrorPage } from "@/pages/error/InternalServerErrorPage";

export const Router = () => {
  return (
    <>
      <Routes>
        {/** ログイン前のページ */}
        <Route element={<AuthRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route
            path="/sign_up/confirmation_sent"
            element={<ConfirmationSent />}
          />
          <Route path="/confirmed" element={<ConfirmedPage />} />
          <Route path="/sign_in" element={<SignInPage />} />
        </Route>

        {/** ログイン後のページ */}

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<ProtectedArea />} />
        </Route>

        {/** エラー表示画面 */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/internal_server_error"
          element={<InternalServerErrorPage />}
        />
      </Routes>
    </>
  );
};
