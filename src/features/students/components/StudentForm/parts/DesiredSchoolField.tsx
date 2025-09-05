import { Input } from '@/components/ui/form/Input/input';
import type { Draft } from '../../../types/studentForm';
import { RequiredLabel } from '@/components/common/form/RequiredLabel';

export default function DesiredSchoolField({
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
      <RequiredLabel htmlFor="desiredSchool">志望校</RequiredLabel>
      <Input
        id="desiredSchool"
        value={value.desired_school}
        onChange={onChange('desired_school')}
        placeholder="志望校を入力してください"
      />
    </div>
  );
}
