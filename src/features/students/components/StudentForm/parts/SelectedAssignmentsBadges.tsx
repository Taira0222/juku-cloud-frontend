import { Badge } from '@/components/ui/display/Badge/badge';
import type { Assignment, Teacher } from '../../../types/studentForm';
import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';
import { DAY_OF_WEEK_WITH_ID } from '@/constants/dayOfWeekTranslations';
import { shortDayLabel } from '@/features/students/constants/studentForm';

export default function SelectedAssignmentsBadges({
  assignments,
  teachers,
  untoggle,
}: {
  assignments: Assignment[];
  teachers: Teacher[];
  untoggle: (a: Assignment) => void;
}) {
  if (!assignments?.length) return null;

  return (
    <section aria-label="選択中の講師" className="flex flex-wrap gap-2 pt-1">
      {assignments.map(({ teacher_id, subject_id, day_id }) => {
        const teacher = teachers.find((t) => t.id === teacher_id);
        const subjectMeta = Object.values(SUBJECT_TRANSLATIONS).find(
          (s) => s.id === subject_id
        );
        const dayMeta = DAY_OF_WEEK_WITH_ID.find((d) => d.id === day_id);
        const subjectName = subjectMeta?.name ?? '';
        const displayDay = shortDayLabel(dayMeta?.name ?? '');
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
}
