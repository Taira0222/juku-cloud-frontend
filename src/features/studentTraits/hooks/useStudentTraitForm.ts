import { useCallback, useEffect, useState } from "react";
import type { Mode } from "@/features/students/types/studentForm";
import { makeByMode } from "@/utils/makeInitialState";

import {
  StudentTraitFormSchema,
  type StudentTraitFormCreateValues,
  type StudentTraitFormEditValues,
  type StudentTraitFormPayloadByMode,
  type StudentTraitFormValuesByMode,
} from "../types/studentTraitForm";
import { StudentTraitInitialValues } from "../constants/studentTraitForm";

export const useStudentTraitForm = <M extends Mode>(
  mode: M,
  initial?: StudentTraitFormValuesByMode<M>
) => {
  const makeInitial = useCallback(
    (): StudentTraitFormValuesByMode<M> =>
      makeByMode<StudentTraitFormCreateValues, StudentTraitFormEditValues>(
        mode as M,
        initial as StudentTraitFormEditValues | undefined,
        StudentTraitInitialValues
      ) as StudentTraitFormValuesByMode<M>,
    [mode, initial]
  );

  // 遅延初期化によって初期値を初回マウント時のみにセットする
  const [value, setValue] = useState<StudentTraitFormValuesByMode<M>>(() =>
    makeInitial()
  );

  useEffect(() => {
    if (mode === "edit" && initial) setValue(initial);
  }, [mode, initial]);

  const schema = StudentTraitFormSchema[mode];

  const submit = (
    onValid: (data: StudentTraitFormPayloadByMode<M>) => void,
    onInvalid?: (msgs: string[]) => void
  ) => {
    const parsed = schema.safeParse(value);
    // 実行時にはmodeとMは一致するので, PayloadByMode<M>は安全な型アサーション
    if (parsed.success)
      onValid(parsed.data as StudentTraitFormPayloadByMode<M>);
    else onInvalid?.(parsed.error.issues.map((i) => i.message));
    return parsed.success;
  };

  const reset = () => setValue(makeInitial());

  return { value, setValue, submit, reset };
};
