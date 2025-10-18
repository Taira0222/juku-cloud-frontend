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
        const matchedSubjectId = selectedSubjectIds.find(
          (sid) => sid === subject_id
        );
        const subjectData = Object.entries(SUBJECT_TRANSLATIONS).find(
          ([, v]) => v.id === matchedSubjectId
        )?.[1];
        const subjectName = subjectData?.name;

        const matchedDayId = selectedDayIds.find((did) => did === day_id);
        const dayData = DAY_OF_WEEK_WITH_ID.find((d) => d.id === matchedDayId);
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
