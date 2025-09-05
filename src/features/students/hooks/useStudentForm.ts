import { useEffect, useState } from 'react';
import type { Draft, StudentFormMode } from '../types/studentForm';
import { normalizePayload } from '../utils/studentFormTransforms';
import { createStudentSchema } from '../types/students';
import { z } from 'zod';

type CreateStudentPayload = z.infer<typeof createStudentSchema>;

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

export const useStudentForm = (mode: StudentFormMode, initial?: Draft) => {
  const [value, setValue] = useState<Draft>(initial ?? INITIAL_DRAFT);

  useEffect(() => {
    if (mode === 'edit' && initial) setValue(initial);
  }, [mode, initial]);

  const submit = (
    onValid: (data: CreateStudentPayload) => void,
    onInvalid?: (msg: string) => void
  ) => {
    const payload = normalizePayload(value);
    const parsed = createStudentSchema.safeParse(payload);
    if (parsed.success) onValid(parsed.data);
    else onInvalid?.(parsed.error.issues.map((i) => i.message).join('\n'));
    return parsed.success;
  };

  const reset = () => setValue(initial ?? INITIAL_DRAFT);

  return { value, setValue, submit, reset };
};
