import { useEffect, useState } from 'react';
import type { Draft, StudentFormMode } from '../types/studentForm';
import { normalizePayload } from '../utils/studentFormTransforms';
import { createStudentSchema, editStudentSchema } from '../types/students';
import { z } from 'zod';

type CreateStudentPayload = z.infer<typeof createStudentSchema>;
type EditStudentPayload = z.infer<typeof editStudentSchema>;
type EditDraft = Draft & { id: number };

const SCHEMA = {
  create: createStudentSchema,
  edit: editStudentSchema,
} as const;

export const INITIAL_DRAFT: Draft = {
  name: '',
  school_stage: '',
  grade: null,
  status: '',
  desired_school: '',
  joined_on: null,
  subject_ids: [],
  available_day_ids: [],
  assignments: [],
};

// モードに応じて submit の型を切り替える
type PayloadByMode<T extends StudentFormMode> = T extends 'edit'
  ? EditStudentPayload
  : CreateStudentPayload;

// modeに応じてDraftの型を切り替える
type DraftByMode<T extends StudentFormMode> = T extends 'edit'
  ? EditDraft
  : Draft;

export const INITIAL_ERROR_MESSAGES =
  'useStudentForm("edit"): initial に id:number が必須です';

export const useStudentForm = <T extends StudentFormMode>(
  mode: T,
  initial?: DraftByMode<T>
) => {
  // 初期値の設定
  const makeInitial = (): DraftByMode<T> => {
    if (mode === 'edit') {
      // editモードの場合、initialが必須でid:numberを持つことを保証
      if (!initial || typeof (initial as EditDraft).id !== 'number') {
        throw new Error(INITIAL_ERROR_MESSAGES);
      }
      return initial as DraftByMode<T>;
    }
    return INITIAL_DRAFT as DraftByMode<T>;
  };

  const [value, setValue] = useState<DraftByMode<T>>(makeInitial());

  useEffect(() => {
    if (mode === 'edit' && initial) setValue(initial);
  }, [mode, initial]);

  // modeに応じてスキーマを切り替え
  const schema = SCHEMA[mode];

  const submit = (
    onValid: (data: PayloadByMode<T>) => void,
    onInvalid?: (msgs: string[]) => void
  ) => {
    const payload = normalizePayload(value);
    const parsed = schema.safeParse(payload);
    if (parsed.success) onValid(parsed.data as PayloadByMode<T>);
    else onInvalid?.(parsed.error.issues.map((i) => i.message));
    return parsed.success;
  };

  const reset = () => setValue(makeInitial());

  return { value, setValue, submit, reset };
};
