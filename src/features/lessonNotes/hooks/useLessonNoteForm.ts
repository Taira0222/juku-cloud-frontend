import { useCallback, useEffect, useState } from "react";
import {
  LessonNoteFormSchema,
  type LessonNoteFormCreateValues,
  type LessonNoteFormEditValues,
  type LessonNoteFormPayloadByMode,
  type LessonNoteFormValuesByMode,
} from "../types/lessonNoteForm";
import { LessonNoteInitialValues } from "../constants/lessonNoteForm";
import type { Mode } from "@/features/students/types/studentForm";
import { makeByMode } from "@/utils/makeInitialState";
import { normalizeLessonNotePayload } from "../utils/lessonNoteFormTransforms";

export const useLessonNoteForm = <M extends Mode>(
  mode: M,
  initial?: LessonNoteFormValuesByMode<M>
) => {
  const makeInitial = useCallback(
    (): LessonNoteFormValuesByMode<M> =>
      makeByMode<LessonNoteFormCreateValues, LessonNoteFormEditValues>(
        mode as M,
        initial as LessonNoteFormEditValues | undefined,
        LessonNoteInitialValues
      ) as LessonNoteFormValuesByMode<M>,
    [mode, initial]
  );

  // 遅延初期化によって初期値を初回マウント時のみにセットする
  const [value, setValue] = useState<LessonNoteFormValuesByMode<M>>(() =>
    makeInitial()
  );

  useEffect(() => {
    if (mode === "edit" && initial) setValue(initial);
  }, [mode, initial]);

  const schema = LessonNoteFormSchema[mode];

  const submit = (
    onValid: (data: LessonNoteFormPayloadByMode<M>) => void,
    onInvalid?: (msgs: string[]) => void
  ) => {
    const payload = normalizeLessonNotePayload<M>(value);
    const parsed = schema.safeParse(payload);
    // 実行時にはmodeとMは一致するので, PayloadByMode<M>は安全な型アサーション
    if (parsed.success) onValid(parsed.data as LessonNoteFormPayloadByMode<M>);
    else onInvalid?.(parsed.error.issues.map((i) => i.message));
    return parsed.success;
  };

  const reset = () => setValue(makeInitial());

  return { value, setValue, submit, reset };
};
