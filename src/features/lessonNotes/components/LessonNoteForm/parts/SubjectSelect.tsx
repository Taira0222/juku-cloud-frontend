import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";

import type { ClassSubjectType } from "@/features/students/types/students";

type SubjectSelectProps = {
  subjectId: number | null;
  subjects: ClassSubjectType[];
  onChange: (value: number) => void;
};

export const SubjectSelect = ({
  subjectId,
  subjects,
  onChange,
}: SubjectSelectProps) => {
  const subjectIdString = subjectId ? String(subjectId) : "科目を選択";
  const handleChange = (value: string) => {
    onChange(Number(value));
  };
  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="subjectId" required>
        科目を選択
      </RequiredLabel>
      <Select value={subjectIdString} onValueChange={handleChange}>
        <SelectTrigger id="subjectId">
          <SelectValue placeholder="科目を選択" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={String(subject.id)}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
