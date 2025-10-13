import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";
import { RequiredLabel } from "@/components/common/form/RequiredLabel";

import { STATUS_SELECT_PROPS } from "@/constants/Form";
import type { ValueKind } from "./type/form";

export type StatusSelectProps<K extends ValueKind> = {
  variant: K;
  status: string;
  onChange: (v: string) => void;
};

export const StatusSelect = <K extends ValueKind>({
  variant,
  status,
  onChange,
}: StatusSelectProps<K>) => {
  const { htmlFor, id, label, TRANSLATIONS } = STATUS_SELECT_PROPS[variant];
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor={htmlFor} required>
        {label}
      </RequiredLabel>
      <Select value={status} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TRANSLATIONS).map(([key, { name }]) => (
            <SelectItem key={key} value={key}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
