import type { Mode } from "@/features/students/types/studentForm";

// 型ガード: valueが{id: number}の形をしているかをチェック
const hasNumericId = (value: unknown): value is { id: number } =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof (value as { id: unknown }).id === "number";

// Cはcreate の型、 Eはeditの型でCを拡張した型でid:numberを持つことを保証
export const makeByMode = <C, E extends C & { id: number }>(
  mode: Mode,
  initial: E | undefined,
  fallback: C,
  errorMessage = "編集では id が必須です"
): C | E => {
  if (mode === "edit") {
    if (!hasNumericId(initial)) throw new Error(errorMessage);
    return initial as E;
  }
  return fallback;
};
