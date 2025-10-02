import { StudentTraitsTable } from "@/features/studentTraits/components/table/StudentTraitsTable";
import { useIsMobile } from "@/hooks/useMobile";
import { useOutletContext } from "react-router-dom";
import type { StudentTraitsContextType } from "./types/studentTraits";
import { useStudentTraitsStore } from "@/stores/studentTraitsStore";
import { useStudentTraitsQuery } from "@/features/studentTraits/queries/useStudentTraitsQuery";
import SpinnerWithText from "@/components/common/status/Loading";
import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export const StudentTraitsPage = () => {
  const { student, studentId } = useOutletContext<StudentTraitsContextType>();
  const filters = useStudentTraitsStore((state) => state.filters);
  const { data, isError, error, isPending } = useStudentTraitsQuery(filters);
  const isMobile = useIsMobile();

  if (isPending) {
    return (
      <div className="p-6">
        <SpinnerWithText className="flex items-center justify-center h-32">
          Loading...
        </SpinnerWithText>
      </div>
    );
  }
  if (isError) {
    return <ErrorDisplay error={getErrorMessage(error)} />;
  }

  return (
    <div className="p-6">
      <StudentTraitsTable
        subjects={student.class_subjects}
        studentId={studentId}
        studentTraits={data.student_traits}
        meta={data.meta}
        isMobile={isMobile}
      />
    </div>
  );
};
