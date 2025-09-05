import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import { STUDENTS_LEVEL_OPTIONS } from '@/constants/studentsLevel';
import type { Draft } from '../../../types/studentForm';
import { RequiredLabel } from '@/components/common/form/RequiredLabel';

export default function LevelSelect({
  value,
  onChange,
}: {
  value: Draft;
  onChange: (v: string) => void; // "stage-grade"
}) {
  const level =
    value.school_stage && typeof value.grade === 'number'
      ? `${value.school_stage}-${value.grade}`
      : '';
  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="selectLevel" required>
        学年を選択
      </RequiredLabel>
      <Select value={level} onValueChange={onChange}>
        <SelectTrigger id="selectLevel">
          <SelectValue placeholder="学年を選択" />
        </SelectTrigger>
        <SelectContent>
          {STUDENTS_LEVEL_OPTIONS.map((opt) => (
            <SelectItem
              key={`${opt.school_stage}-${opt.grade}`}
              value={`${opt.school_stage}-${opt.grade}`}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
