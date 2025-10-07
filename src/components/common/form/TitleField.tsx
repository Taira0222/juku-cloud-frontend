import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Input } from "@/components/ui/form/Input/input";
import type { Mode } from "@/features/students/types/studentForm";
import type { FormValuesByVariant, Variant } from "./type/form";

export type TitleFieldProps<M extends Mode, V extends Variant> = {
  variant: V;
  title: string;
  onChange: (
    field: keyof FormValuesByVariant<M, V>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TitleField = <M extends Mode, V extends Variant>({
  title,
  onChange,
}: TitleFieldProps<M, V>) => {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor="title" required>
        タイトル
      </RequiredLabel>
      <Input
        id="title"
        value={title}
        onChange={onChange("title")}
        placeholder="タイトルを入力"
        required
      />
    </div>
  );
};
