import type { FormEvent } from "react";
import { useTeacherUpdate } from "../mutations/useTeacherUpdate";
import { useTeachersStore } from "@/stores/teachersStore";
import { formatEditData } from "./formatEditData";
import { toast } from "sonner";
import type { TeacherSubmitProps } from "../types/teacherForm";

export const TeacherSubmit = ({
  formData,
  teacherId,
  handleClose,
}: TeacherSubmitProps) => {
  const updateTeacherLocal = useTeachersStore(
    (state) => state.updateTeacherLocal
  );
  const { error, loading, updateTeacher } = useTeacherUpdate();
  // teacherStore 更新用の成型済みデータを取得
  const { formatSubjectsData, formatDaysData } = formatEditData({
    formData,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      employment_status: formData.employment_status,
      subject_ids: formatSubjectsData()
        .filter((subject) => subject.id !== undefined)
        .map((subject) => subject.id),
      available_day_ids: formatDaysData()
        .filter((day) => day.id !== undefined)
        .map((day) => day.id),
    };

    const result = await updateTeacher(teacherId, submitData);

    if (result.ok) {
      const updatedId = result.updatedId;
      if (updatedId == null) {
        toast.error("APIレスポンスに更新IDが含まれていません。");
        return;
      }
      updateTeacherLocal(updatedId, {
        name: formData.name,
        employment_status: formData.employment_status,
        subjects: formatSubjectsData(),
        available_days: formatDaysData(),
      });

      toast.success("更新に成功しました");
      handleClose();
    } else {
      toast.error("更新に失敗しました");
    }
  };
  return { handleSubmit, loading, error };
};
