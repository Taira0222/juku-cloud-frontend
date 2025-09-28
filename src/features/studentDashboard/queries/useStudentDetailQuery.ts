import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { StudentDetail } from "../type/studentDashboard";
import { studentKeys } from "@/features/key";
import { fetchStudent } from "../api/fetchStudentApi";

export const useStudentDetailQuery = (studentId: number) =>
  useQuery<StudentDetail, unknown>({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => fetchStudent(studentId),
    // 更新されるまで、前のデータを表示したままにする
    placeholderData: keepPreviousData,
  });
