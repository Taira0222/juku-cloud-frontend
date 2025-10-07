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
import { StudentTraitsPage } from "@/pages/studentTraits/StudentTraitsPage";
import { EditLessonNoteDialog } from "@/features/lessonNotes/components/dialog/EditLessonNoteDialog";
import { EditStudentTraitDialog } from "@/features/studentTraits/components/dialog/EditStudentTraitDialog";

export const ProtectedArea = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;

  return (
    <>
      {/* 背景・通常用のルーティング */}
      <Routes location={background || location}>
        {/** admin, teacher 共通 */}
        <Route element={<RoleRoute allowedRoles={["admin", "teacher"]} />}>
          {/** 管理画面 */}
          <Route element={<ManagementDashboard />}>
            <Route path="/students" element={<StudentsPage />} />
          </Route>

          {/** 生徒ごとのページ */}
          <Route element={<StudentDashboard />}>
            <Route path="/dashboard/:studentId" element={<DashboardPage />} />
            {/* 直アクセスされた際のエラーハンドリング用 */}
            {!background && (
              <>
                <Route
                  path="/dashboard/:studentId/lesson-notes/:lessonNoteId/edit"
                  element={<EditLessonNoteDialog />}
                />
              </>
            )}
          </Route>
        </Route>

        {/* admin 専用*/}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<ManagementDashboard />}>
            <Route path="/teachers" element={<TeachersPage />} />
            {/* 直アクセスされた際のエラーハンドリング用 */}
            {!background && (
              <>
                <Route
                  path="/teachers/:teacherId/edit"
                  element={<EditTeacherDialog />}
                />
                <Route
                  path="/students/:studentId/edit"
                  element={<EditStudentDialog />}
                />
              </>
            )}
          </Route>
          {/** 生徒ごとのページ */}
          <Route element={<StudentDashboard />}>
            <Route
              path="/dashboard/:studentId/student-traits"
              element={<StudentTraitsPage />}
            />
            {!background && (
              <Route
                path="/dashboard/:studentId/student-traits/:studentTraitId/edit"
                element={<EditStudentTraitDialog />}
              />
            )}
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
          <Route element={<RoleRoute allowedRoles={["teacher", "admin"]} />}>
            <Route
              path="/dashboard/:studentId/lesson-notes/:lessonNoteId/edit"
              element={<EditLessonNoteDialog />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              path="/teachers/:teacherId/edit"
              element={<EditTeacherDialog />}
            />
            <Route
              path="/students/:studentId/edit"
              element={<EditStudentDialog />}
            />
            <Route
              path="/dashboard/:studentId/student-traits/:studentTraitId/edit"
              element={<EditStudentTraitDialog />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
};
