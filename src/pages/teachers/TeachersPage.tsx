import SpinnerWithText from '@/components/common/status/Loading';
import { useFetchTeachers } from '@/features/teachers/queries/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/useFormatTeachersData';
import { TeacherTable } from '@/features/teachers/components/table/TeachersTable';
import { ErrorDisplay } from '@/components/common/status/ErrorDisplay';

export const TeachersPage = () => {
  const { loading, error, currentUserData, teachersData } = useFetchTeachers();
  // loadingがfalse になったら useFormatTeachersData を作成
  useFormatTeachersData(
    currentUserData,
    teachersData,
    !loading && !!teachersData
  );

  if (loading) {
    return (
      <div className="p-6">
        <SpinnerWithText className="flex items-center justify-center h-32">
          Loading...
        </SpinnerWithText>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ErrorDisplay error={error} />
      <TeacherTable />
    </div>
  );
};
