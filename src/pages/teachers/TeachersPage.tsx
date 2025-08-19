import SpinnerWithText from '@/components/common/status/Loading';
import { DataTable } from '@/features/teachers/components/Table/DataTable';
import { useFetchTeachers } from '@/features/teachers/hooks/Table/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/Table/useFomatTeachersData';

export const TeachersPage = () => {
  const { loading, error, refetch, currentUserData, teachersData } =
    useFetchTeachers();
  const { dataTable, getDetailDrawerData } = useFormatTeachersData(
    currentUserData,
    teachersData
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
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <DataTable
        data={dataTable}
        getDetailDrawerData={getDetailDrawerData}
        refetch={refetch}
      />
    </div>
  );
};
