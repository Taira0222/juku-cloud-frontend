import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './PrivateRouter';

export const Router = () => {
  return (
    <Routes>
      {/* ルートパスにHomeコンポーネントをマッピング */}
      <Route path="/" element={<Home />} />
      {/* ログイン後の生徒一覧 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/student_management" element={<StudentManagement />} />
      </Route>
    </Routes>
  );
};
