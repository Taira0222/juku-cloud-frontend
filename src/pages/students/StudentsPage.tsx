import SpinnerWithText from '@/components/common/status/Loading';
import { StudentsTable } from '@/features/students/components/table/StudentsTable';
import { useStudentsQuery } from '@/features/students/queries/useStudentsQuery';
import { getErrorMessage } from '@/lib/errors/getErrorMessage';
import { useStudentsStore } from '@/stores/studentsStore';

export const StudentsPage = () => {
  const filters = useStudentsStore((state) => state.filters);
  const { data, error, isError, isPending } = useStudentsQuery(filters);

  if (isPending) {
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
      {isError && (
        <div className="text-red-500 mb-4">{getErrorMessage(error)}</div>
      )}
      <StudentsTable
        data={data?.students ?? []}
        meta={
          data?.meta ?? {
            total_pages: 0,
            total_count: 0,
            current_page: 0,
            per_page: 0,
          }
        }
      />
    </div>
  );
};
