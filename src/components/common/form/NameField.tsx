import { RequiredLabel } from "@/components/common/form/RequiredLabel";

import { Input } from "@/components/ui/form/Input/input";
import { NAME_FIELD_PROPS } from "@/constants/Form";

import type { ValueKind, ValueType } from "@/types";

export type NameProps<T extends ValueType, K extends ValueKind> = {
  variant: K;
  value: T;
  onChange: (
    field: keyof T
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NameField = <T extends ValueType, K extends ValueKind>({
  variant,
  value,
  onChange,
}: NameProps<T, K>) => {
  const { id, htmlFor, label, placeholder } = NAME_FIELD_PROPS[variant];
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor={htmlFor} required>
        {label}
      </RequiredLabel>
      <Input
        id={id}
        value={value.name}
        onChange={onChange("name")}
        placeholder={placeholder}
        required
      />
    </div>
  );
};
