import { DataTable } from '@/features/teachers/components/Table';
import { useFetchTeachers } from '@/features/teachers/hooks/useFetchTeachers';
import { useFormatTeachersData } from '@/features/teachers/hooks/useFomatTeachersData';

export const TeachersPage = () => {
  const { dataTable, getDetailDrawerData } = useFormatTeachersData();
  const { error } = useFetchTeachers();
  return (
    <div className="p-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <DataTable data={dataTable} getDetailDrawerData={getDetailDrawerData} />
    </div>
  );
};
