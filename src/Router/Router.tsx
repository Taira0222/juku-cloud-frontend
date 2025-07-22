import { Home } from '@/components/Home/Home';
import { StudentManagement } from '@/components/Managements/StudentManagement';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ルートパスにHomeコンポーネントをマッピング */}
        <Route path="/" element={<Home />} />
        {/* ログイン後の生徒一覧 */}
        <Route path="/student_management" element={<StudentManagement />} />
      </Routes>
    </BrowserRouter>
  );
};
