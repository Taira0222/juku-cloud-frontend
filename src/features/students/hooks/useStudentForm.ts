import { useEffect, useState } from "react";
import type {
  Draft,
  DraftByMode,
  EditDraft,
  PayloadByMode,
  SchemaByMode,
  StudentFormMode,
} from "../types/studentForm";
import { normalizePayload } from "../utils/studentFormTransforms";
import { createStudentSchema, editStudentSchema } from "../types/students";

// satisfiesで型を保証
const SCHEMA = {
  create: createStudentSchema,
  edit: editStudentSchema,
} as const satisfies SchemaByMode;

export const INITIAL_DRAFT: Draft = {
  name: "",
  school_stage: "",
  grade: null,
  status: "",
  desired_school: "",
  joined_on: "",
  subject_ids: [],
  available_day_ids: [],
  assignments: [],
};

const getSchema = <M extends StudentFormMode>(m: M) => SCHEMA[m];
export const INITIAL_ERROR_MESSAGES =
  'useStudentForm("edit"): initial に id:number が必須です';

export const useStudentForm = <T extends StudentFormMode>(
  mode: T,
  initial?: DraftByMode<T>
) => {
  // 初期値の設定
  const makeInitial = (): DraftByMode<T> => {
    if (mode === "edit") {
      // editモードの場合、initialが必須でid:numberを持つことを保証
      if (!initial || typeof (initial as EditDraft).id !== "number") {
        throw new Error(INITIAL_ERROR_MESSAGES);
      }
      return initial as DraftByMode<T>;
    }
    return INITIAL_DRAFT as DraftByMode<T>;
  };

  const [value, setValue] = useState<DraftByMode<T>>(makeInitial());

  useEffect(() => {
    if (mode === "edit" && initial) setValue(initial);
  }, [mode, initial]);

  // modeに応じてスキーマを切り替え
  const schema = getSchema(mode);

  const submit = (
    onValid: (data: PayloadByMode<T>) => void,
    onInvalid?: (msgs: string[]) => void
  ) => {
    const payload = normalizePayload(value);
    const parsed = schema.safeParse(payload);
    // 実行時にはmodeとTは一致するので, PayloadByMode<T>は安全な型アサーション
    if (parsed.success) onValid(parsed.data as PayloadByMode<T>);
    else onInvalid?.(parsed.error.issues.map((i) => i.message));
    return parsed.success;
  };

  const reset = () => setValue(makeInitial());

  return { value, setValue, submit, reset };
};
