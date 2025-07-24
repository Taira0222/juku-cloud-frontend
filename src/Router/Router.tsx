import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { SignIn } from '@/components/SignIn/SignIn';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign_in" element={<SignIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/student_management" element={<StudentManagement />} />
      </Route>
    </Routes>
  );
};
