import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Input } from "@/components/ui/form/Input/input";
import type { LessonNoteFormValuesByMode } from "@/features/lessonNotes/types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";

type DescriptionFieldProps<M extends Mode> = {
  description: string | null;
  onChange: (
    field: keyof LessonNoteFormValuesByMode<M>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const DescriptionField = <M extends Mode>({
  description,
  onChange,
}: DescriptionFieldProps<M>) => {
  return (
    <div className="space-y-2">
      <RequiredLabel htmlFor="description" required>
        詳細説明
      </RequiredLabel>
      <Input
        id="description"
        value={description ?? undefined}
        onChange={onChange("description")}
        placeholder="詳細説明を入力"
        required
      />
    </div>
  );
};
