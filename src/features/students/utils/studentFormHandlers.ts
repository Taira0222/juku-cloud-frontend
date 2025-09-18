import type { ChangeEvent } from "react";
import type {
  Assignment,
  ToggleableKeys,
  OnChange,
  StudentFormMode,
  DraftByMode,
} from "../types/studentForm";
import { toggleAssignment, toggleValueById } from "./studentFormToggles";

export const createStudentFormHandlers = <M extends StudentFormMode>(
  onChange: OnChange<M>
) => {
  // Draftの型をmodeに応じて切り替え
  type Draft = DraftByMode<M>;

  const handleInputChange =
    (field: keyof Draft) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // 入塾日と通塾状況の際に使用
  const handleSelectChange =
    <T extends keyof Draft>(field: T) =>
    (value: Draft[T]) => {
      onChange((prev) => ({ ...prev, [field]: value }));
    };

  // 学年セレクトの際に使用
  const handleStudentOptionChange = (value: string) => {
    onChange((prev) => {
      if (value === "") return { ...prev, school_stage: "", grade: null };
      const [stage, grade] = value.split("-");
      return { ...prev, school_stage: stage, grade: Number(grade) };
    });
  };

  // 科目・曜日に使用、追加や削除ができる
  const toggleInArray = (key: ToggleableKeys, id: number) => {
    onChange((prev) => ({
      ...prev,
      [key]: toggleValueById(prev[key] ?? [], id),
    }));
  };

  const toggleAssignmentInForm = (a: Assignment) => {
    onChange((prev) => ({
      ...prev,
      assignments: toggleAssignment(prev.assignments ?? [], a),
    }));
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleStudentOptionChange,
    toggleInArray,
    toggleAssignmentInForm,
  };
};
