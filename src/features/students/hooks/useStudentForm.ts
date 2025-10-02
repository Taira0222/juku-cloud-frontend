import { useEffect, useState } from "react";
import type {
  Draft,
  DraftByMode,
  EditDraft,
  Mode,
  PayloadByMode,
  SchemaByMode,
} from "../types/studentForm";
import { normalizePayload } from "../utils/studentFormTransforms";
import { createStudentSchema, editStudentSchema } from "../types/students";
import { makeByMode } from "@/utils/makeInitiakState";

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

const getSchema = <M extends Mode>(m: M) => SCHEMA[m];
export const INITIAL_ERROR_MESSAGES =
  'useStudentForm("edit"): initial に id:number が必須です';

export const useStudentForm = <M extends Mode>(
  mode: M,
  initial?: DraftByMode<M>
) => {
  // 初期値の設定
  const makeInitial = (): DraftByMode<M> =>
    makeByMode<Draft, EditDraft>(
      mode as M,
      initial as EditDraft | undefined,
      INITIAL_DRAFT,
      INITIAL_ERROR_MESSAGES
    ) as DraftByMode<M>;

  const [value, setValue] = useState<DraftByMode<M>>(makeInitial());

  useEffect(() => {
    if (mode === "edit" && initial) setValue(initial);
  }, [mode, initial]);

  // modeに応じてスキーマを切り替え
  const schema = getSchema(mode);

  const submit = (
    onValid: (data: PayloadByMode<M>) => void,
    onInvalid?: (msgs: string[]) => void
  ) => {
    const payload = normalizePayload(value);
    const parsed = schema.safeParse(payload);
    // 実行時にはmodeとMは一致するので, PayloadByMode<M>は安全な型アサーション
    if (parsed.success) onValid(parsed.data as PayloadByMode<M>);
    else onInvalid?.(parsed.error.issues.map((i) => i.message));
    return parsed.success;
  };

  const reset = () => setValue(makeInitial());

  return { value, setValue, submit, reset };
};
