import type { ChangeEvent } from "react";
import type {
  setFormDataType,
  TeacherFormData,
  ToggleableKeys,
} from "../types/teacherForm";

export const TeacherFormHandler = (setFormData: setFormDataType) => {
  // 名前の変更
  const handleInputChange =
    (field: keyof TeacherFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // 出勤状況の変更
  const handleSelectEmployment = (value: string) => {
    setFormData((prev) => ({ ...prev, employment_status: value }));
  };

  // 配列のトグル操作ユーティリティ関数
  const toggleValue = <T>(list: T[], v: T) => {
    const arr = new Set(list);
    if (arr.has(v)) {
      arr.delete(v);
    } else {
      arr.add(v);
    }
    return Array.from(arr);
  };

  const toggleInArray = (key: ToggleableKeys, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: toggleValue(prev[key], value) }));
  };

  return { handleInputChange, handleSelectEmployment, toggleInArray };
};
