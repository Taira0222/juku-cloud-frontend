import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import { Label } from "@/components/ui/form/Label/label";
import { DAY_OF_WEEK_WITH_ID } from "@/constants/dayOfWeekTranslations";
import type { Assignment, Draft } from "../../../types/studentForm";
import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { useEffect } from "react";

export type DayCheckboxesProps = {
  value: Draft;
  toggle: (id: number) => void;
  untoggleAssignments: (a: Assignment) => void;
};

export const DayCheckboxes = ({
  value,
  toggle,
  untoggleAssignments,
}: DayCheckboxesProps) => {
  const selected = value.available_day_ids ?? [];
  useEffect(() => {
    if (!value.assignments) return;
    // 曜日が解除されたときに関連する担当講師も解除する
    value.assignments.forEach((a) => {
      if (!selected.includes(a.day_id)) {
        untoggleAssignments(a);
      }
    });
  }, [selected]);
  return (
    <div className="space-y-2">
      <RequiredLabel required>受講可能曜日（複数可）</RequiredLabel>
      <div className="grid grid-cols-2 gap-2">
        {DAY_OF_WEEK_WITH_ID.map(({ id, name }) => {
          const checkboxId = `day-checkbox-${id}`;
          return (
            <div key={id} className="flex items-center gap-2">
              <Checkbox
                id={checkboxId}
                checked={selected.includes(id)}
                onCheckedChange={() => toggle(id)}
                aria-label={name}
              />
              <Label htmlFor={checkboxId} className="font-normal text-base">
                {name}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
