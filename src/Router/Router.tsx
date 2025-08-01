import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SignIn } from '@/components/SignIn/SignIn';
import { SignUp } from '@/components/SignUp/SignUp';
import { ConfirmationSent } from '@/components/Confirm/ConfirmationSent';
import { ConfirmedPage } from '@/components/Confirm/ConfirmedPage';
import { NotFound } from '@/components/Error/NotFound';
import { AuthRoute } from './AuthRoute';

export const Router = () => {
  return (
    <Routes>
      {/** ログイン前のページ */}
      <Route element={<AuthRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route
          path="/sign_up/confirmation_sent"
          element={<ConfirmationSent />}
        />
        <Route path="/confirmed" element={<ConfirmedPage />} />
        <Route path="/sign_in" element={<SignIn />} />
      </Route>
      {/** ログイン後のページ */}
      <Route element={<ProtectedRoute />}>
        <Route path="/student_management" element={<StudentManagement />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
