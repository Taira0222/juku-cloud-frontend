import type { Mode } from "@/features/students/types/studentForm";
import type { LessonNoteFormProps } from "../../types/lessonNoteForm";
import { Button } from "@/components/ui/form/Button/button";

import { lessonNoteFormHandlers } from "@/features/lessonNotes/utils/lessonNoteFormHandlers";
import { TitleField } from "../../../../components/common/form/TitleField";
import { DescriptionField } from "../../../../components/common/form/DescriptionField";
import { NoteTypeSelect } from "./parts/NoteTypeSelect";
import { ExpireDatePicker } from "./parts/ExpireDatePicker";
import { SubjectSelect } from "./parts/SubjectSelect";
import { SubjectField } from "./parts/SubjectField";

export const LessonNoteForm = <M extends Mode>({
  mode,
  value,
  subjects,
  onChange,
  onSubmit,
  loading,
}: LessonNoteFormProps<M>) => {
  const H = lessonNoteFormHandlers(onChange);
  const variant = "lessonNote";
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="px-4 sm:px-6 py-6 space-y-5"
      >
        {/* 科目 (編集モードなら科目の表示だけ)*/}
        {mode === "edit" ? (
          <SubjectField subject_id={value.subject_id} subjects={subjects} />
        ) : (
          <SubjectSelect
            subjects={subjects}
            onChange={H.handleSelectChange("subject_id")}
          />
        )}

        {/* タイトル */}
        <TitleField
          variant={variant}
          title={value.title}
          onChange={H.handleInputChange}
        />

        {/* 説明 */}
        <DescriptionField
          variant={variant}
          description={value.description}
          onChange={H.handleTextAreaChange}
        />

        {/* 分類 */}
        <NoteTypeSelect
          noteType={value.note_type}
          onChange={H.handleSelectChange("note_type")}
        />

        {/* 有効期限 */}
        <ExpireDatePicker
          expireDate={value.expire_date}
          onChange={H.handleSelectChange("expire_date")}
        />

        <div className="mt-6 gap-2 sm:justify-between">
          <Button type="submit" disabled={loading}>
            {mode === "edit" ? "更新" : "作成"}
          </Button>
        </div>
      </form>
    </>
  );
};
