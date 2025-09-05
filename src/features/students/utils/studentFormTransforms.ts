import { SUBJECT_TRANSLATIONS } from '@/constants/subjectTranslations';
import type { Draft } from '../types/studentForm';

export const dateToISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const isoToDate = (iso?: string | null) => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const normalizePayload = (draft: Draft) => ({
  ...draft,
  desired_school:
    draft.desired_school && draft.desired_school.trim() !== ''
      ? draft.desired_school.trim()
      : null,
});

export const getSubjectLabel = (id: number) =>
  Object.entries(SUBJECT_TRANSLATIONS).find(([, v]) => v.id === id)?.[0] ??
  '科目が見つかりませんでした';
