import { Input } from '@/components/ui/form/Input/input';
import type { Draft } from '../../../types/studentForm';
import { RequiredLabel } from '@/components/common/form/RequiredLabel';

export default function NameField({
  value,
  onChange,
}: {
  value: Draft;
  onChange: (
    field: keyof Draft
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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
}
