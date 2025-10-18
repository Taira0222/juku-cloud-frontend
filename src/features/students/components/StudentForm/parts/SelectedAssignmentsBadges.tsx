import { Badge } from "@/components/ui/display/Badge/badge";
import type { Assignment, Teacher } from "../../../types/studentForm";
import { SUBJECT_TRANSLATIONS } from "@/constants/subjectTranslations";
import { DAY_OF_WEEK_WITH_ID } from "@/constants/dayOfWeekTranslations";
import { shortDayLabel } from "@/features/students/constants/studentForm";

export type SelectedAssignmentsBadgesProps = {
  assignments: Assignment[];
  selectedSubjectIds: number[];
  selectedDayIds: number[];
  teachers: Teacher[];
  untoggle: (a: Assignment) => void;
};

export const SelectedAssignmentsBadges = ({
  assignments,
  teachers,
  selectedSubjectIds,
  selectedDayIds,
  untoggle,
}: SelectedAssignmentsBadgesProps) => {
  if (!assignments?.length) return null;

  return (
    <section aria-label="選択中の講師" className="flex flex-wrap gap-2 pt-1">
      {assignments.map(({ teacher_id, subject_id, day_id }) => {
        const teacher = teachers.find((t) => t.id === teacher_id);

        // 選択されていない科目・曜日のバッジは表示しない
        if (!selectedSubjectIds.includes(subject_id)) return null;
        if (!selectedDayIds.includes(day_id)) return null;

        const subjectData = Object.values(SUBJECT_TRANSLATIONS).find(
          (s) => s.id === subject_id
        );
        const subjectName = subjectData?.name ?? "";
        const dayData = DAY_OF_WEEK_WITH_ID.find((d) => d.id === day_id);
        const displayDay = shortDayLabel(dayData?.name ?? "");

        return (
          <Badge
            key={`${teacher_id}:${subject_id}:${day_id}`}
            variant="secondary"
            className="cursor-pointer text-muted-foreground inline-flex items-center gap-1"
            onClick={() => untoggle({ teacher_id, subject_id, day_id })}
            aria-label={`${teacher?.name} を削除`}
          >
            <span>{`${teacher?.name}(${displayDay},${subjectName})`}</span>
            <span aria-hidden="true">✕</span>
          </Badge>
        );
      })}
    </section>
  );
};
