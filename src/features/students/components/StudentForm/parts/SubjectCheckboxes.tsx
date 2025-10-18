import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import { Label } from "@/components/ui/form/Label/label";
import { Badge } from "@/components/ui/display/Badge/badge";
import { SUBJECT_TRANSLATIONS } from "@/constants/subjectTranslations";
import type { Assignment, Draft } from "../../../types/studentForm";
import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { useEffect } from "react";

export type SubjectCheckboxesProps = {
  value: Draft;
  toggle: (id: number) => void;
  untoggleAssignments: (a: Assignment) => void;
};

export const SubjectCheckboxes = ({
  value,
  toggle,
  untoggleAssignments,
}: SubjectCheckboxesProps) => {
  const selected = value.subject_ids ?? [];

  useEffect(() => {
    if (!value.assignments) return;
    // 科目が解除されたときに関連する担当講師も解除する
    value.assignments.forEach((a) => {
      if (!selected.includes(a.subject_id)) {
        untoggleAssignments(a);
      }
    });
  }, [selected]);
  return (
    <div className="space-y-2">
      <RequiredLabel required>受講科目（複数可）</RequiredLabel>
      <div className="grid grid-cols-2 gap-3 py-2">
        {Object.entries(SUBJECT_TRANSLATIONS).map(([key, { id, name }]) => {
          const checkboxId = `subject-checkbox-${key}`;
          return (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={checkboxId}
                checked={selected.includes(id)}
                onCheckedChange={() => toggle(id)}
              />
              <Label htmlFor={checkboxId} className="font-normal text-base">
                {name}
              </Label>
            </div>
          );
        })}
      </div>
      {selected.length > 0 && (
        <section
          aria-label="選択中の担当科目"
          className="flex flex-wrap gap-2 pt-1"
        >
          {selected.map((id) => {
            const meta = Object.values(SUBJECT_TRANSLATIONS).find(
              (s) => s.id === id
            );
            const label = meta?.name ?? "不明な科目";
            const Icon = meta?.icon;
            const color = meta?.color ?? "gray";
            return (
              <Badge
                key={id}
                variant="secondary"
                className={`cursor-pointer text-muted-foreground inline-flex items-center gap-1 ${color}`}
                onClick={() => toggle(id)}
                aria-label={`${label} を削除`}
              >
                {Icon && <Icon aria-hidden="true" className="inline-block" />}
                <span>{label}</span>
                <span aria-hidden="true">✕</span>
              </Badge>
            );
          })}
        </section>
      )}
    </div>
  );
};
