import { useStudentsStore } from "@/stores/studentsStore";

import { useStudentsQuery } from "../queries/useStudentsQuery";
import type { editLocationState } from "../types/students";

export const useStudentForEdit = (
  studentId: number,
  state?: editLocationState
) => {
  const stateStudent = state?.student;
  const filters = useStudentsStore((state) => state.filters);

  // state でstudent が渡されてなければ、students の一覧を refetch する
  const { data, isLoading } = useStudentsQuery(filters, {
    enabled: !stateStudent,
  });

  const student =
    stateStudent ?? data?.students.find((s) => s.id === studentId);
  // 取得処理完了済みだが、該当IDの生徒が存在しない場合
  const isNotFound = !isLoading && !!data && !student;

  return { student, isNotFound, isLoading };
};
