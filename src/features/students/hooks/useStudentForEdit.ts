import { useStudentsStore } from "@/stores/studentsStore";
import { useLocation } from "react-router-dom";
import { useStudentsQuery } from "../queries/useStudentsQuery";

export const useStudentForEdit = (studentId: number) => {
  const location = useLocation();
  const stateStudent = location.state.student;
  const filters = useStudentsStore((state) => state.filters);

  // state でstudent が渡されてなければ、students の一覧を refetch する
  const { data } = useStudentsQuery(filters, { enabled: !stateStudent });

  const student =
    stateStudent ?? data?.students.find((s) => s.id === studentId);
  return { student };
};
