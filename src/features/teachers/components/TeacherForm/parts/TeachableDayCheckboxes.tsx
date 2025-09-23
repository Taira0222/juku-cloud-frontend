import { RequiredLabel } from "@/components/common/form/RequiredLabel";
import { Checkbox } from "@/components/ui/form/CheckBox/checkbox";
import { Label } from "@/components/ui/form/Label/label";
import { DAY_OF_WEEK_TRANSLATIONS } from "@/constants/dayOfWeekTranslations";
import type { TeacherFormData } from "@/features/teachers/types/teacherForm";

export type TeachableDayCheckboxesProps = {
  formData: TeacherFormData;
  onChange: (field: "available_days", value: string) => void;
};

export const TeachableDayCheckboxes = ({
  formData,
  onChange,
}: TeachableDayCheckboxesProps) => {
  return (
    <div className="space-y-2">
      <RequiredLabel required>担当可能曜日（複数可）</RequiredLabel>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(DAY_OF_WEEK_TRANSLATIONS).map(([key, name]) => {
          const checkboxId = `day-checkbox-${key}`;
          return (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={checkboxId}
                checked={formData.available_days.includes(key)}
                onCheckedChange={() => onChange("available_days", key)}
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
