import { AppSidebar } from "@/components/common/dashboard/app-sidebar";
import { StudentSiteHeader } from "@/features/studentDashboard/components/dashboard/StudentSiteHeader";
import SpinnerWithText from "@/components/common/status/Loading";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/layout/Sidebar/sidebar";
import { getStudentDashboardData } from "@/features/studentDashboard/components/getStudentDashboardData";
import { useStudentDetailQuery } from "@/features/studentDashboard/queries/useStudentDetailQuery";
import type { User } from "@/stores/userStore";
import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useLessonNotesStore } from "@/stores/lessonNotesStore";
import { useEffect } from "react";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { useStudentTraitsStore } from "@/stores/studentTraitsStore";
import { useStudentTraitsQuery } from "@/features/studentTraits/queries/useStudentTraitsQuery";

export const StudentDashboard = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const studentIdNumber = Number(studentId);
  // 整数でない、または0以下の数値なら404へリダイレクト
  if (!Number.isInteger(studentIdNumber) || studentIdNumber <= 0)
    return <Navigate to="/404" replace />;

  const user = useOutletContext<User>();
  const setNotesFilters = useLessonNotesStore((state) => state.setFilters);
  const setTraitsFilters = useStudentTraitsStore((state) => state.setFilters);
  const traitsFilters = useStudentTraitsStore((state) => state.filters);

  const {
    data: studentData,
    isError: isStudentError,
    error: studentError,
    isPending: studentPending,
  } = useStudentDetailQuery(studentIdNumber);

  const studentQuery = useStudentTraitsQuery(
    { ...traitsFilters, student_id: studentIdNumber },
    { enabled: studentIdNumber > 0 }
  );

  useEffect(() => {
    // 生徒IDが変わったらフィルターを更新
    setTraitsFilters({ student_id: studentIdNumber });
  }, [studentIdNumber]);

  useEffect(() => {
    const subjects = studentData?.class_subjects ?? [];
    if (subjects.length === 0) return;
    const first = subjects[0].id;
    setNotesFilters({ student_id: studentIdNumber, subject_id: first });
  }, [studentIdNumber, studentData]);

  const sidebarData = getStudentDashboardData({
    role: user.role,
    user: {
      name: user.name,
      email: user.email,
    },
    id: studentIdNumber.toString(),
  });

  if (!sidebarData) return <Navigate to="/404" replace />;

  // useStudentDetailQuery のローディングとエラーハンドリング
  if (studentPending)
    return (
      <div className="p-6">
        <SpinnerWithText className="flex items-center justify-center h-32">
          Loading...
        </SpinnerWithText>
      </div>
    );
  if (isStudentError)
    return <ErrorDisplay error={getErrorMessage(studentError)} />;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/** ここがサイドバー部分 */}
      <AppSidebar variant="inset" data={sidebarData} />
      {/** ここがメイン部分 */}
      <SidebarInset>
        <StudentSiteHeader school={user.school} data={studentData} />

        <div className="flex flex-1 flex-col">
          {/** ここがメインコンテンツ部分 */}

          <Outlet
            context={{
              student: studentData,
              studentTraits: studentQuery,
              role: user.role,
              studentId: studentIdNumber,
            }}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
