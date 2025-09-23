import { Button } from "@/components/ui/form/Button/button";
import { DialogFooter } from "@/components/ui/navigation/Dialog/dialog";
import { TeacherFormHandler } from "../../utils/TeacherFormHandler";
import type { TeacherFormProps } from "../../types/teacherForm";
import { NameField } from "@/components/common/form/NameField";
import { StatusSelect } from "@/components/common/form/StatusSelect";
import { TeachableSubjectCheckboxes } from "./parts/TeachableSubjectCheckboxes";
import { TeachableDayCheckboxes } from "./parts/TeachableDayCheckboxes";

export const TeacherForm = ({
  formData,
  setFormData,
  handleClose,
  onSubmit,
}: TeacherFormProps) => {
  const H = TeacherFormHandler(setFormData);
  const variant = "TeacherFormData";
  return (
    <form onSubmit={onSubmit} className="px-4 sm:px-6 py-6 space-y-5">
      <div className="space-y-4">
        <NameField
          variant={variant}
          value={formData}
          onChange={H.handleInputChange}
        />

        {/* 出勤状況：Select */}
        <StatusSelect
          variant={variant}
          status={formData.employment_status}
          onChange={H.handleSelectEmployment}
        />

        {/* 担当科目：複数チェック */}
        <TeachableSubjectCheckboxes
          formData={formData}
          onChange={H.toggleInArray}
        />

        {/* 担当可能曜日：複数チェック */}
        <TeachableDayCheckboxes
          formData={formData}
          onChange={H.toggleInArray}
        />
      </div>

      <DialogFooter className="mt-6 gap-2 sm:justify-between">
        <Button type="button" variant="outline" onClick={handleClose}>
          キャンセル
        </Button>
        <Button type="submit">更新</Button>
      </DialogFooter>
    </form>
  );
};
