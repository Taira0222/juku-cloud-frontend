import { RoleRoute } from "./RoleRoute";
import { ManagementDashboard } from "@/pages/managementDashboard/ManagementDashboard";
import { TeachersPage } from "@/pages/teachers/TeachersPage";
import { StudentsPage } from "@/pages/students/StudentsPage";
import { Route, Routes, useLocation } from "react-router-dom";
import { EditTeacherDialog } from "@/features/teachers/components/dialogs/EditTeacherDialog";
import { ForbiddenPage } from "@/pages/error/ForbiddenPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { StudentDashboard } from "@/pages/studentDashboard/StudentDashboard";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { InternalServerErrorPage } from "@/pages/error/InternalServerErrorPage";
import { EditStudentDialog } from "@/features/students/components/dialog/EditStudentDialog";

export const ProtectedArea = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;

  return (
    <>
      {/* 背景・通常用のルーティング */}
      <Routes location={background || location}>
        {/** 管理画面：admin, teacher 共通のレイアウト */}
        <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
          <Route element={<ManagementDashboard />}>
            {/* admin, teacher 共通 */}
            <Route path="/students" element={<StudentsPage />} />
            {/* 直アクセス時された際のエラーハンドリング用 */}
            {!background && (
              <Route
                path="/students/:id/edit"
                element={<EditStudentDialog />}
              />
            )}

            {/* admin 専用：NestedRoute で権限チェック */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/teachers" element={<TeachersPage />} />
              {/* 直アクセス時された際のエラーハンドリング用 */}
              {!background && (
                <Route
                  path="/teachers/:id/edit"
                  element={<EditTeacherDialog />}
                />
              )}
            </Route>
          </Route>
        </Route>

        {/** 生徒ごとのページ（別レイアウト） */}
        <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
          <Route element={<StudentDashboard />}>
            <Route path="/dashboard/:id" element={<DashboardPage />} />
          </Route>
        </Route>

        {/** エラー表示画面 */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route
          path="/internal_server_error"
          element={<InternalServerErrorPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* モーダル用：背景がある時だけ重ねる */}
      {background && (
        <Routes>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/teachers/:id/edit" element={<EditTeacherDialog />} />
            <Route path="/students/:id/edit" element={<EditStudentDialog />} />
          </Route>
        </Routes>
      )}
    </>
  );
};
