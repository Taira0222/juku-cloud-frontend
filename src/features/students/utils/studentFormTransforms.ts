import { SUBJECT_TRANSLATIONS } from "@/constants/subjectTranslations";
import type { Draft } from "../types/studentForm";
import { format, parseISO } from "date-fns";

export const dateToISO = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const isoToDate = (iso?: string | null) => {
  return iso ? parseISO(iso) : undefined;
};

export const normalizePayload = (draft: Draft) => ({
  ...draft,
  desired_school:
    draft.desired_school && draft.desired_school.trim() !== ""
      ? draft.desired_school.trim()
      : null,
});

export const getSubjectLabel = (id: number) =>
  Object.entries(SUBJECT_TRANSLATIONS).find(([, v]) => v.id === id)?.[0] ??
  "科目が見つかりませんでした";
