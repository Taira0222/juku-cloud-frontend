import type { Assignment } from '../types/studentForm';

export const toggleValueById = (list: number[], v: number) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

const keyOf = (a: Assignment) => `${a.teacher_id}:${a.subject_id}:${a.day_id}`;
export const toggleAssignment = (list: Assignment[], a: Assignment) => {
  const k = keyOf(a);
  return list.some((x) => keyOf(x) === k)
    ? list.filter((x) => keyOf(x) !== k)
    : [...list, a];
};
