import { Checkbox } from '@/components/ui/form/CheckBox/checkbox';
import type { Assignment, Teacher } from '../../../types/studentForm';
import { subjectBadgeUtils } from '@/utils/subjectBadgeUtils';
import { getSubjectLabel } from '@/features/students/utils/studentFormTransforms';

export type TeacherAssignmentTabsProps = {
  dayId: number;
  teachers: Teacher[];
  selectedSubjectIds: number[];
  assigned: Assignment[];
  toggle: (a: Assignment) => void;
};

export const TeacherAssignmentTabs = ({
  dayId,
  teachers,
  selectedSubjectIds,
  assigned,
  toggle,
}: TeacherAssignmentTabsProps) => {
  const { createIconTranslationBadge } = subjectBadgeUtils('mx-0');

  const isAssigned = (tId: number, sId: number, dId: number) =>
    assigned.some(
      (a) => a.teacher_id === tId && a.subject_id === sId && a.day_id === dId
    );

  if (!teachers?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        この曜日に選択された科目を指導可能な講師がいません。
      </p>
    );
  }

  return (
    <>
      {teachers.map((teacher) => (
        <div key={teacher.id} className="space-y-1">
          <div className="font-medium">{teacher.name}</div>
          <div className="ml-4 flex flex-wrap gap-2">
            {teacher.teachable_subjects.map((subject) => {
              const matched = selectedSubjectIds.includes(subject.id);
              if (!matched) return null;
              const checked = isAssigned(teacher.id, subject.id, dayId);
              return (
                <label key={subject.id} className="flex items-center gap-1">
                  <Checkbox
                    aria-label={`${teacher.name}の${getSubjectLabel(
                      subject.id
                    )}の割り当て`}
                    checked={checked}
                    onCheckedChange={() =>
                      toggle({
                        teacher_id: teacher.id,
                        subject_id: subject.id,
                        day_id: dayId,
                      })
                    }
                  />
                  {createIconTranslationBadge(getSubjectLabel(subject.id))}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};
