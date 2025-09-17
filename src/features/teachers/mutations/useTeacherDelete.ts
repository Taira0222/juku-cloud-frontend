import { useCallback, useState } from "react";
import { deleteTeacherApi } from "../api/deleteTeacherApi";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export const useTeacherDelete = () => {
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const deleteTeacher = useCallback(async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTeacherApi(teacherId);
      return { ok: true as const };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, deleteTeacher };
};
