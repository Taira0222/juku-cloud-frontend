import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import SpinnerWithText from "@/components/common/status/Loading";
import { StudentsTable } from "@/features/students/components/table/StudentsTable";
import { useStudentsQuery } from "@/features/students/queries/useStudentsQuery";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { useStudentsStore } from "@/stores/studentsStore";
import type { ContextType } from "@/types";

import { useOutletContext } from "react-router-dom";

export const StudentsPage = () => {
  const { role } = useOutletContext<ContextType>();
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
      {isError && <ErrorDisplay error={getErrorMessage(error)} />}
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
        isAdmin={role === "admin"}
      />
    </div>
  );
};
