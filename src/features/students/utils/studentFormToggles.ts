import type { Assignment } from '../types/studentForm';

// subject_ids, available_day_ids の配列の中で、v があれば削除、なければ追加した配列を返す
export const toggleValueById = (list: number[], v: number) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

const keyOf = (a: Assignment) => `${a.teacher_id}:${a.subject_id}:${a.day_id}`;
export const toggleAssignment = (list: Assignment[], a: Assignment) => {
  const k = keyOf(a);
  return list.some((x) => keyOf(x) === k)
    ? list.filter((x) => keyOf(x) !== k)
    : [...list, a];
};
