import { useCallback, useState } from "react";
import type { updateTeacherRequest } from "../types/teachers";
import { updateTeacherApi } from "../api/updateTeacherApi";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export const useTeacherUpdate = () => {
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const updateTeacher = useCallback(
    async (teacherId: number, formData: updateTeacherRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateTeacherApi(teacherId, formData);
        const responseTeacherId = response.data.teacher_id;
        return { ok: true as const, updatedId: responseTeacherId };
      } catch (err) {
        const errorMessage = getErrorMessage(err);

        setError(errorMessage);
        return { ok: false as const };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { error, loading, updateTeacher };
};
