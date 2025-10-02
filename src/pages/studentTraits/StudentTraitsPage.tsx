import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import { StudentTraitsTable } from "@/features/studentTraits/components/table/StudentTraitsTable";
import type { StudentTraitsContextType } from "@/features/studentTraits/types/studentTraits";
import { useIsMobile } from "@/hooks/useMobile";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { Navigate, useOutletContext } from "react-router-dom";

export const StudentTraitsPage = () => {
  const { query, studentId } = useOutletContext<StudentTraitsContextType>();
  const isMobile = useIsMobile();
  const { data, isError, error } = query;
  if (!data) return <Navigate to="/404" replace />;

  return (
    <div className="p-6">
      {isError && <ErrorDisplay error={getErrorMessage(error)} />}
      <StudentTraitsTable
        studentId={studentId}
        studentTraits={data.student_traits}
        isMobile={isMobile}
      />
    </div>
  );
};
