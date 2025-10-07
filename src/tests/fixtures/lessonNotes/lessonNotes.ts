import type {
  LessonNoteCreate,
  LessonNoteCreateRequest,
  LessonNoteEdit,
  lessonNoteType,
  LessonNoteUpdateRequest,
} from "@/features/lessonNotes/types/lessonNote";
import { addDays, format } from "date-fns";
import { teacher1, teacher2, teacher3 } from "../teachers/teachers";
import type { LessonNoteFormCreateValues } from "@/features/lessonNotes/types/lessonNoteForm";
import type { ClassSubjectType } from "@/features/students/types/students";

export const lessonNote1: lessonNoteType = {
  id: 1,
  title: "英語の宿題",
  description: "次回の授業までに問題集の1章を解いてくること。",
  note_type: "homework",
  created_by_name: teacher1.name,
  last_updated_by_name: teacher2.name,
  expire_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  created_by: {
    id: teacher1.id, // idは2
    name: teacher1.name,
  },
  last_updated_by: {
    id: teacher2.id, // idは3
    name: teacher2.name,
  },
  student_class_subject: {
    id: 1,
    class_subject: {
      id: 1,
      name: "english",
    },
  },
  created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  updated_at: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
};

export const lessonNote2: lessonNoteType = {
  id: 2,
  title: "英語の授業",
  description: "テストが近いので、テスト対策用の問題集を使用する。",
  note_type: "lesson",
  created_by_name: teacher2.name,
  last_updated_by_name: null,
  expire_date: format(new Date(), "yyyy-MM-dd"),
  created_by: {
    id: teacher2.id, // idは3
    name: teacher2.name,
  },
  last_updated_by: null,
  student_class_subject: {
    id: 1,
    class_subject: {
      id: 1,
      name: "english",
    },
  },
  created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
};

export const lessonNote3: lessonNoteType = {
  id: 3,
  title: "数学の宿題",
  description: "次回の授業までに問題集の2章を解いてくること。",
  note_type: "homework",
  created_by_name: teacher3.name,
  last_updated_by_name: null,
  expire_date: format(new Date(), "yyyy-MM-dd"),
  created_by: {
    id: teacher3.id, // idは4
    name: teacher3.name,
  },
  last_updated_by: null,
  student_class_subject: {
    id: 2,
    class_subject: {
      id: 3,
      name: "mathematics",
    },
  },
  created_at: format(new Date(), "2024-01-01T10:00:00'Z'"),
  updated_at: format(new Date(), "2024-01-01T10:00:00'Z'"),
};
// 英語でフィルタリングするようにするのでlesson3入れない
export const lessonNotesMock: lessonNoteType[] = [lessonNote1, lessonNote2];

export const LessonNotesMeta = {
  total_pages: 1,
  total_count: 2,
  current_page: 1,
  per_page: 5,
};

export const lessonNoteCreateFormMockValue: LessonNoteCreate = {
  subject_id: 1,
  title: lessonNote1.title,
  description: lessonNote1.description,
  note_type: lessonNote1.note_type,
  expire_date: lessonNote1.expire_date,
};

export const createLessonNotePayload: LessonNoteCreateRequest = {
  student_id: 1,
  ...lessonNoteCreateFormMockValue,
};

export const createResponseLessonNoteMock: lessonNoteType = lessonNote1;

export const editLessonNoteFormMockValue: LessonNoteEdit = {
  id: lessonNote1.id,
  subject_id: lessonNote1.student_class_subject.class_subject.id,
  title: "更新後のタイトル",
  description: "更新後の説明",
  note_type: lessonNote1.note_type,
  expire_date: lessonNote1.expire_date,
};

export const editLessonNotePayload: LessonNoteUpdateRequest = {
  ...editLessonNoteFormMockValue,
  student_id: 1,
};

export const editResponseLessonNoteMock: lessonNoteType = {
  ...lessonNote1,
  title: "更新後のタイトル",
  description: "更新後の説明",
};

export const initialLessonFormCreateMockValue: LessonNoteFormCreateValues = {
  subject_id: undefined,
  title: "",
  description: null,
  note_type: undefined,
  expire_date: undefined,
};

export const initialLessonFormEditMockValue: LessonNoteEdit = {
  ...lessonNoteCreateFormMockValue,
  id: lessonNote1.id,
};

export const mockSubjects: ClassSubjectType[] = [
  { id: 1, name: "english" },
  { id: 3, name: "mathematics" },
];
