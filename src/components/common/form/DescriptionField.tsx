import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Textarea } from "@/components/ui/form/TextArea/textarea";
import type { Mode } from "@/features/students/types/studentForm";
import type { FormValuesByVariant, Variant } from "./type/form";

export type DescriptionFieldProps<M extends Mode, V extends Variant> = {
  variant: V;
  description: string | null;
  onChange: (
    field: keyof FormValuesByVariant<M, V>
  ) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const DescriptionField = <M extends Mode, V extends Variant>({
  description,
  onChange,
}: DescriptionFieldProps<M, V>) => {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor="description" required={false}>
        詳細説明
      </RequiredLabel>
      <Textarea
        id="description"
        value={description ?? ""}
        onChange={onChange("description")}
        placeholder="詳細説明を入力"
      />
    </div>
  );
};
