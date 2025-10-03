import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Textarea } from "@/components/ui/form/TextArea/textarea";
import type { LessonNoteFormValuesByMode } from "@/features/lessonNotes/types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";

type DescriptionFieldProps<M extends Mode> = {
  description: string | null;
  onChange: (
    field: keyof LessonNoteFormValuesByMode<M>
  ) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const DescriptionField = <M extends Mode>({
  description,
  onChange,
}: DescriptionFieldProps<M>) => {
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
        required={false}
      />
    </div>
  );
};
