import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SignIn } from '@/components/SignIn/SignIn';
import { SignUp } from '@/components/SignUp/SignUp';
import { ConfirmationSent } from '@/components/SignUp/ConfirmationSent';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign_in" element={<SignIn />} />
      <Route path="/sign_up" element={<SignUp />} />
      <Route path="/sign_up/confirmation_sent" element={<ConfirmationSent />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/student_management" element={<StudentManagement />} />
      </Route>
    </Routes>
  );
};
