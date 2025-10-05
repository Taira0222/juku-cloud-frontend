import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";
import { SUBJECT_JA_NAMES } from "@/constants/subjectTranslations";

import type { ClassSubjectType } from "@/features/students/types/students";
import { useState } from "react";

export type SubjectSelectProps = {
  subjects: ClassSubjectType[];
  onChange: (value: number) => void;
};

export const SubjectSelect = ({ subjects, onChange }: SubjectSelectProps) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const handleChange = (value: string) => {
    setValue(value);
    onChange(Number(value));
  };
  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="subjectId" required>
        科目を選択
      </RequiredLabel>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="subjectId">
          <SelectValue placeholder="科目を選択" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={String(subject.id)}>
              {SUBJECT_JA_NAMES[subject.name].name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
