import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";

import { LessonNotesTable } from "@/features/lessonNotes/components/table/LessonNotesTable";
import type { DashboardContextType } from "@/pages/dashboard/type/dashboard";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { useOutletContext } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { StudentTraitList } from "@/features/studentTraits/components/list/StudentTraitList";
import { useLessonNotesQuery } from "@/features/lessonNotes/queries/useLessonNotesQuery";
import { useLessonNotesStore } from "@/stores/lessonNotesStore";
import SpinnerWithText from "@/components/common/status/Loading";

export const DashboardPage = () => {
  const { student, studentTraits, role, studentId } =
    useOutletContext<DashboardContextType>();
  const filters = useLessonNotesStore((state) => state.filters);

  const {
    data: traitsData,
    isError: isTraitsError,
    error: traitsError,
    isPending: traitsPending,
  } = studentTraits;

  // 生徒IDが0以下の場合は取得しない
  const { data, isError, error, isPending } = useLessonNotesQuery(filters, {
    enabled: filters.student_id > 0,
  });

  const isMobile = useIsMobile();

  if (isPending || traitsPending) {
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
  if (isTraitsError) {
    return <ErrorDisplay error={getErrorMessage(traitsError)} />;
  }

  const studentTraitsData = traitsData.student_traits;

  const goodTraits = studentTraitsData.filter((t) => t.category === "good");
  const carefulTraits = studentTraitsData.filter(
    (t) => t.category === "careful"
  );

  return (
    <div className="space-y-5 px-8 py-2">
      <h2 className="text-lg font-medium text-gray-600 px-4">生徒の特性</h2>

      {/** 生徒の特性 */}
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 ",
          isMobile ? "px-2" : "px-10 mb-6"
        )}
      >
        <StudentTraitList
          cardTitle="よい特性"
          traits={goodTraits}
          category="good"
          isMobile={isMobile}
        />
        <StudentTraitList
          cardTitle="注意が必要な特性"
          traits={carefulTraits}
          category="careful"
          isMobile={isMobile}
        />
      </div>

      <h2 className="text-lg font-medium text-gray-600 px-4">
        科目ごとの引継ぎ事項
      </h2>
      <LessonNotesTable
        studentId={studentId}
        subjects={student.class_subjects}
        lessonNotes={data.lesson_notes}
        meta={data.meta}
        isAdmin={role === "admin"}
        isMobile={isMobile}
      />
    </div>
  );
};
