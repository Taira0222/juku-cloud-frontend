import type { ChangeEvent } from "react";
import type { Mode } from "@/features/students/types/studentForm";
import type {
  OnChangeStudentTrait,
  StudentTraitFormValuesByMode,
} from "../types/studentTraitForm";

export const studentTraitFormHandlers = <M extends Mode>(
  onChange: OnChangeStudentTrait<M>
) => {
  const handleInputChange =
    (field: keyof StudentTraitFormValuesByMode<M>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({ ...prev, [field]: e.target.value }));
    };
  const handleTextAreaChange =
    (field: keyof StudentTraitFormValuesByMode<M>) =>
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Selectコンポーネント用のハンドラー
  const handleSelectChange =
    <T extends keyof StudentTraitFormValuesByMode<M>>(field: T) =>
    (value: StudentTraitFormValuesByMode<M>[T]) => {
      onChange((prev) => ({ ...prev, [field]: value }));
    };

  return {
    handleInputChange,
    handleTextAreaChange,
    handleSelectChange,
  };
};
