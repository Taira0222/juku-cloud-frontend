import { RequiredLabel } from '@/components/common/form/RequiredLabel';

import { Input } from '@/components/ui/form/Input/input';
import type { Draft } from '@/features/students/types/studentForm';

export type NameProps = {
  value: Draft;
  onChange: (
    field: keyof Draft
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NameField = ({ value, onChange }: NameProps) => {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor="studentName" required>
        生徒の名前
      </RequiredLabel>
      <Input
        id="studentName"
        value={value.name}
        onChange={onChange('name')}
        placeholder="生徒の名前を入力してください"
        required
      />
    </div>
  );
};
