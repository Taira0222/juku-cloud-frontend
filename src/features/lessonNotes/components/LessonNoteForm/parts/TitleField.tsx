import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Input } from "@/components/ui/form/Input/input";
import type { LessonNoteFormValuesByMode } from "@/features/lessonNotes/types/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";

type TitleFieldProps<M extends Mode> = {
  title: string;
  onChange: (
    field: keyof LessonNoteFormValuesByMode<M>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TitleField = <M extends Mode>({
  title,
  onChange,
}: TitleFieldProps<M>) => {
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
