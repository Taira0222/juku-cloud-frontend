import { RoleRoute } from './RoleRoute';
import { ManagementDashboard } from '@/pages/managementDashboard/ManagementDashboard';
import { TeachersPage } from '@/pages/teachers/TeachersPage';
import { SubjectsPage } from '@/pages/subjects/SubjectsPage';
import { LearningMaterialsPage } from '@/pages/learningMaterial/LearningMaterialsPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import { EditTeacherDialog } from '@/features/teachers/components/dialogs/EditTeacherDialog';
import { ForbiddenPage } from '@/pages/error/ForbiddenPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

export const ProtectedArea = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;

  return (
    <>
      {/* 背景・通常用のルーティング */}
      <Routes location={background || location}>
        {/** admin, teacher 共通 */}
        <Route element={<RoleRoute allowedRoles={['admin', 'teacher']} />}>
          <Route element={<ManagementDashboard />}>
            <Route path="/students" element={<StudentsPage />} />
          </Route>
        </Route>

        {/** admin 専用 */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<ManagementDashboard />}>
            <Route path="/teachers" element={<TeachersPage />} />
            {/* 直アクセス時に表示されるフルページ版の編集 エラーハンドリングを行う */}
            <Route path="/teachers/:id/edit" element={<EditTeacherDialog />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route
              path="/learning_materials"
              element={<LearningMaterialsPage />}
            />
          </Route>
        </Route>
        {/** エラー表示画面 */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* モーダル用：背景がある時だけ重ねる */}
      {background && (
        <Routes>
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/teachers/:id/edit" element={<EditTeacherDialog />} />
          </Route>
          {/** エラー表示画面 */}
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </>
  );
};
