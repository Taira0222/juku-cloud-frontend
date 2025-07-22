import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { PrivateRouter } from './PrivateRouter';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ルートパスにHomeコンポーネントをマッピング */}
        <Route path="/" element={<Home />} />
        {/* ログイン後の生徒一覧 */}
        <Route element={<PrivateRouter />}>
          <Route path="/student_management" element={<StudentManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
