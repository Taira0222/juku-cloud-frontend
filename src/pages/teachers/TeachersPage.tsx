import SpinnerWithText from '@/components/common/status/Loading';
import { DataTable } from '@/features/teachers/components/table/DataTable';

import { useFetchTeachers } from '@/features/teachers/queries/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/useFormatTeachersData';

export const TeachersPage = () => {
  const { loading, error, currentUserData, teachersData } = useFetchTeachers();
  // loadingがfalse になったら useFormatTeachersData を作成
  useFormatTeachersData(currentUserData, teachersData, !loading);

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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <DataTable />
    </div>
  );
};
