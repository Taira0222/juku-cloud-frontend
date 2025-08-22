// 教科と曜日: Backend 固定 ID / name
export type MasterItem = { id: number; name: string };

// 教科 (readonlyで再代入不可能な配列として定義)
export const SUBJECTS: readonly MasterItem[] = [
  { id: 1, name: 'english' },
  { id: 2, name: 'japanese' },
  { id: 3, name: 'mathematics' },
  { id: 4, name: 'science' },
  { id: 5, name: 'social_studies' },
] as const;

// 曜日
export const AVAILABLE_DAYS: readonly MasterItem[] = [
  { id: 1, name: 'sunday' },
  { id: 2, name: 'monday' },
  { id: 3, name: 'tuesday' },
  { id: 4, name: 'wednesday' },
  { id: 5, name: 'thursday' },
  { id: 6, name: 'friday' },
  { id: 7, name: 'saturday' },
] as const;
