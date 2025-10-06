import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/Select/select";
import {
  NOTE_TYPE,
  type NoteTypeAttr,
} from "@/features/lessonNotes/constants/lessonNoteTable";
import type { NoteType } from "@/features/lessonNotes/types/lessonNote";

export type NoteTypeSelectProps = {
  noteType?: NoteType;
  onChange: (value: NoteType) => void;
};

export const NoteTypeSelect = ({ noteType, onChange }: NoteTypeSelectProps) => {
  // 内部受け取りでNoteType に変更する
  const handleChange = (v: string) => onChange(v as NoteType);
  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="noteType" required>
        分類を選択
      </RequiredLabel>
      <Select value={noteType ?? undefined} onValueChange={handleChange}>
        <SelectTrigger id="noteType">
          <SelectValue placeholder="分類を選択" />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(NOTE_TYPE) as [NoteType, NoteTypeAttr][]).map(
            ([key, note]) => (
              <SelectItem key={key} value={key}>
                {note.name}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
