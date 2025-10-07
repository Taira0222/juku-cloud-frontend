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
  noteType?: NoteType; // undefined = 未選択
  onChange: (value?: NoteType) => void;
};
// 型ガード
const isNoteType = (value: string): value is NoteType => value in NOTE_TYPE;

export const NoteTypeSelect = ({ noteType, onChange }: NoteTypeSelectProps) => {
  const handleChange = (value: string) => {
    if (value === "") {
      onChange(undefined); // クリア
      return;
    }
    if (isNoteType(value)) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-1">
      <RequiredLabel htmlFor="noteType" required>
        分類を選択
      </RequiredLabel>
      <Select value={noteType ?? ""} onValueChange={handleChange}>
        <SelectTrigger id="noteType" aria-label="分類を選択">
          <SelectValue placeholder="分類を選択" />
        </SelectTrigger>
        <SelectContent>
          {/* クリアを許可したいなら以下を追加
          <SelectItem value="">未選択</SelectItem>
          */}
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
