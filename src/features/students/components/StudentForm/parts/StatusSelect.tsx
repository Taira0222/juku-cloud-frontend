import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/Select/select';
import { STUDENT_STATUS_TRANSLATIONS } from '@/constants/studentStatusTranslations';
import type { Draft } from '../../../types/studentForm';
import { RequiredLabel } from '@/components/common/form/RequiredLabel';

export type StatusSelectProps = {
  value: Draft;
  onChange: (v: string) => void;
};

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor="status" required>
        通塾状況
      </RequiredLabel>
      <Select value={value.status} onValueChange={onChange}>
        <SelectTrigger id="status">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STUDENT_STATUS_TRANSLATIONS).map(
            ([key, { name }]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
