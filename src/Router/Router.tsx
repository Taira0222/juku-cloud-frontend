import { Home } from '@/components/Home/Home';
import { StudentsManagement } from '@/components/ManagementDashboard/StudentsManagement/StudentsManagement';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SignIn } from '@/components/SignIn/SignIn';
import { SignUp } from '@/components/SignUp/SignUp';
import { ConfirmationSent } from '@/components/Confirm/ConfirmationSent';
import { ConfirmedPage } from '@/components/Confirm/ConfirmedPage';
import { NotFound } from '@/components/Error/NotFound';
import { AuthRoute } from './AuthRoute';
import { ManagementDashboard } from '@/components/ManagementDashboard/ManagementDashboard';
import { TeachersManagement } from '@/components/ManagementDashboard/TeachersManagement/TeachersManagement';
import { SubjectManagement } from '@/components/ManagementDashboard/SubjectsManagement/SubjectsManagement';
import { MaterialsManagement } from '@/components/ManagementDashboard/MaterialsManagement/MaterialsManagement';

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
        {/** ここが管理者ダッシュボードのルート */}
        <Route element={<ManagementDashboard />}>
          <Route path="/students_management" element={<StudentsManagement />} />
          <Route path="/teachers_management" element={<TeachersManagement />} />
          <Route path="/subjects_management" element={<SubjectManagement />} />
          <Route
            path="/materials_management"
            element={<MaterialsManagement />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
