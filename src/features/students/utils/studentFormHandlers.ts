import type { ChangeEvent } from 'react';
import type { Draft, Assignment, ToggleableKeys } from '../types/studentForm';
import { toggleAssignment, toggleValueById } from './studentFormToggles';

type OnChange = (updater: Draft | ((prev: Draft) => Draft)) => void;

export const createStudentFormHandlers = (onChange: OnChange) => {
  const handleInputChange =
    (field: keyof Draft) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSelectChange =
    <T>(field: keyof Draft) =>
    (value: T) => {
      onChange((prev) => ({ ...prev, [field]: value } as Draft));
    };

  const handleStudentOptionChange = (value: string) => {
    onChange((prev) => {
      if (value === '') return { ...prev, school_stage: '', grade: null };
      const [stage, grade] = value.split('-');
      return { ...prev, school_stage: stage, grade: Number(grade) };
    });
  };

  const toggleInArray = (key: ToggleableKeys, id: number) => {
    onChange(
      (prev) =>
        ({ ...prev, [key]: toggleValueById(prev[key] ?? [], id) } as Draft)
    );
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
