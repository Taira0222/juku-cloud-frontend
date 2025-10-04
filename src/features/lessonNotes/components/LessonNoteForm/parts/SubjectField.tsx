import { Label } from "@/components/ui/form/Label/label";
import type { ClassSubjectType } from "@/features/students/types/students";
import { subjectBadgeUtils } from "@/utils/subjectBadgeUtils";

type SubjectFieldProps = {
  subject_id?: number;
  subjects: ClassSubjectType[];
};

export const SubjectField = ({ subject_id, subjects }: SubjectFieldProps) => {
  const subject = subjects.find((subject) => subject.id === subject_id);
  const { createIconTranslationBadge } = subjectBadgeUtils("text-sm");

  if (!subject) {
    return <div className="text-red-500">不明な科目 (ID: {subject_id})</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="subject" className="flex items-center gap-1">
        科目
      </Label>
      <span className="text-gray-700">
        {createIconTranslationBadge(subject.name) || "不明な科目"}
      </span>
    </div>
  );
};
