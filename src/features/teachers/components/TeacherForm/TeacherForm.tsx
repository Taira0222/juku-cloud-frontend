import { Button } from "@/components/ui/form/Button/button";
import { DialogFooter } from "@/components/ui/navigation/Dialog/dialog";
import { TeacherFormHandler } from "../../utils/TeacherFormHandler";
import type { TeacherFormProps } from "../../types/teacherForm";
import { NameField } from "@/components/common/form/NameField";
import { StatusSelect } from "@/components/common/form/StatusSelect";
import { TeachableSubjectCheckboxes } from "./parts/TeachableSubjectCheckboxes";
import { TeachableDayCheckboxes } from "./parts/TeachableDayCheckboxes";
import { Link } from "react-router-dom";

export const TeacherForm = ({
  formData,
  setFormData,
  handleClose,
  onSubmit,
  teacher,
}: TeacherFormProps) => {
  const H = TeacherFormHandler(setFormData);
  const variant = "TeacherFormData";
  const students = teacher?.students ?? [];

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
        {/** 指導している生徒がいる場合、先に連携を解除する必要あり */}
        {students.length > 0 && (
          <>
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
              <p className="text-sm text-muted-foreground mb-5">
                この講師は以下の生徒を指導しています。講師情報を編集する前に、各生徒の編集画面で講師との連携を解除してください。
              </p>

              <ul className="list-disc bg-yellow-50 pl-5 mt-2 space-y-1 text-left">
                {students.map((student) => (
                  <li key={student.id}>{student.name}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-6">
              <Button variant="secondary" asChild size="sm" className="px-4">
                <Link to="/students">生徒一覧へ</Link>
              </Button>
            </div>
          </>
        )}

        {students.length === 0 && (
          <>
            <TeachableSubjectCheckboxes
              formData={formData}
              onChange={H.toggleInArray}
            />

            <TeachableDayCheckboxes
              formData={formData}
              onChange={H.toggleInArray}
            />
          </>
        )}
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
