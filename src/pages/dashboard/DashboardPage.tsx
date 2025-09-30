import { ErrorDisplay } from "@/components/common/status/ErrorDisplay";
import { StudentTraitField } from "@/features/dashboard/components/StudentTraitField";
import { LessonNotesTable } from "@/features/lessonNotes/components/table/LessonNotesTable";
import type { DashboardContextType } from "@/features/dashboard/type/dashboard";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { Navigate, useOutletContext } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";

export const DashboardPage = () => {
  const { query, role } = useOutletContext<DashboardContextType>();
  const isMobile = useIsMobile();
  const { data, isError, error } = query;
  if (!data) return <Navigate to="/404" replace />;

  const goodTraits = data.student_traits.filter((t) => t.category === "good");
  const carefulTraits = data.student_traits.filter(
    (t) => t.category === "careful"
  );

  return (
    <div className="space-y-5 px-8 py-2">
      {isError && <ErrorDisplay error={getErrorMessage(error)} />}
      <div>
        <h2 className="text-lg font-medium text-gray-600 px-4">生徒の特性</h2>
      </div>

      {/** 生徒の特性 */}
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 ",
          isMobile ? "px-2" : "px-10 mb-6"
        )}
      >
        <StudentTraitField
          cardTitle="よい特性"
          traits={goodTraits}
          category="good"
          isMobile={isMobile}
        />
        <StudentTraitField
          cardTitle="注意が必要な特性"
          traits={carefulTraits}
          category="careful"
          isMobile={isMobile}
        />
      </div>
      <LessonNotesTable
        subjects={data.class_subjects}
        lessonNotes={data.lesson_notes}
        isAdmin={role === "admin"}
        isMobile={isMobile}
      />
    </div>
  );
};
