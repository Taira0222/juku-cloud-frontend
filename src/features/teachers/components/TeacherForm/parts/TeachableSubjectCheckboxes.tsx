import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Badge } from "@/components/ui/display/Badge/badge";
import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import { Label } from "@/components/ui/form/Label/label";
import { SUBJECT_TRANSLATIONS } from "@/constants/subjectTranslations";
import type { TeacherFormData } from "@/features/teachers/types/teacherForm";

export type TeachableSubjectCheckboxesProps = {
  formData: TeacherFormData;
  onChange: (field: "subjects", value: string) => void;
};

export const TeachableSubjectCheckboxes = ({
  formData,
  onChange,
}: TeachableSubjectCheckboxesProps) => {
  return (
    <div className="space-y-2">
      <RequiredLabel required>担当科目（複数可）</RequiredLabel>
      <div className="grid grid-cols-2 gap-3 py-2">
        {/** 複数選択可能な担当科目のチェックボックス */}
        {Object.entries(SUBJECT_TRANSLATIONS).map(([key, { name }]) => {
          const checkboxId = `subject-checkbox-${key}`;
          return (
            <div key={key} className="flex items-center gap-2 ">
              <Checkbox
                id={checkboxId}
                checked={formData.subjects.includes(key)}
                onCheckedChange={() => onChange("subjects", key)}
              />
              <Label htmlFor={checkboxId} className="font-normal text-base">
                {name}
              </Label>
            </div>
          );
        })}
      </div>
      {/** 選択された担当科目を表示するバッジ */}
      {formData.subjects.length > 0 && (
        <section
          aria-label="選択中の担当科目"
          className="flex flex-wrap gap-2 pt-1"
        >
          {formData.subjects.map((v) => {
            const label = SUBJECT_TRANSLATIONS[v]?.name ?? v;
            const Icon = SUBJECT_TRANSLATIONS[v]?.icon;
            const color = SUBJECT_TRANSLATIONS[v]?.color ?? "gray";

            return (
              <Badge
                key={v}
                variant="secondary"
                className={`cursor-pointer text-muted-foreground inline-flex items-center gap-1 ${color}`}
                onClick={() => onChange("subjects", v)}
                aria-label={`${label} を削除`}
              >
                {Icon && <Icon aria-hidden="true" className="inline-block" />}
                <span>{label}</span>
                <span aria-hidden="true">✕</span>{" "}
              </Badge>
            );
          })}
        </section>
      )}
    </div>
  );
};
