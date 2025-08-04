import { Home } from '@/pages/home/HomePage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SignInPage } from '@/pages/auth/SignInPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { ConfirmationSent } from '@/pages/confirm/ConfirmationSentPage';
import { ConfirmedPage } from '@/pages/confirm/ConfirmedPage';
import { NotFound } from '@/pages/error/NotFoundPage';
import { AuthRoute } from './AuthRoute';
import { ManagementDashboard } from '@/pages/managementDashboard/ManagementDashboard';
import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { SubjectsPage } from '@/pages/subjects/SubjectsPage';
import { LearningMaterialsPage } from '@/pages/learningMaterial/LearningMaterialsPage';

export const Router = () => {
  return (
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
        {/** ここが管理者ダッシュボードのルート */}
        <Route element={<ManagementDashboard />}>
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route
            path="/learning_materials"
            element={<LearningMaterialsPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
