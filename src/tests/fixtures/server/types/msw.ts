import type { SignInSuccessResponse } from "@/features/auth/types/auth";
import type {
  SignUpErrorResponse,
  SignUpSuccessResponse,
} from "@/features/auth/types/signUp";
import type { TokenConfirmSuccessResponse } from "@/features/auth/types/tokenConfirm";
import type { LessonNoteListFilters } from "@/features/lessonNotes/key";
import type {
  FetchLessonNotesResponse,
  LessonNoteCreateRequest,
  lessonNoteType,
  LessonNoteUpdateRequest,
} from "@/features/lessonNotes/types/lessonNote";
import type { StudentDetail } from "@/features/studentDashboard/type/studentDashboard";
import type {
  createStudentPayload,
  editStudentPayload,
  FetchStudentsSuccessResponse,
  Student,
} from "@/features/students/types/students";
import type { StudentTraitListFilters } from "@/features/studentTraits/key";
import type { FetchStudentTraitsResponse } from "@/features/studentTraits/types/studentTraits";
import type { InviteTokenSuccessResponse } from "@/features/teachers/types/inviteToken";
import type {
  fetchTeachersSuccessResponse,
  updateTeacherRequest,
  updateTeacherSuccessResponse,
} from "@/features/teachers/types/teachers";

// エラーの共通型
export type Errors = {
  code: string;
  field?: string;
  message: string;
}[];

export type CommonErrorResponse = {
  errors: Errors;
};

// サインインの型定義

export type SignInRequestBodyType = {
  email: string;
  password: string;
};

export type SignInResponseBodyType =
  | SignInSuccessResponse
  | CommonErrorResponse;

// サインアップの型定義

export type SignUpRequestBodyType = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
};

export type SignUpResponseBodyType =
  | SignUpSuccessResponse
  | SignUpErrorResponse;

// 講師一覧の型定義

export type TeacherFetchResponseBodyType =
  | fetchTeachersSuccessResponse
  | CommonErrorResponse;

// 講師作成トークンの型定義

export type InviteTokenCreateResponseBodyType =
  | InviteTokenSuccessResponse
  | CommonErrorResponse;

// トークン確認の型定義
export type TokenConfirmPathParams = {
  token: string;
};

export type TokenConfirmResponseBodyType =
  | TokenConfirmSuccessResponse
  | CommonErrorResponse;

// 講師削除の型定義
export type TeacherDeletePathParams = {
  id: string;
};
export type TeacherDeleteResponseBodyType = CommonErrorResponse;

// 講師更新の型定義
export type TeacherUpdatePathParams = {
  id: string;
};

export type TeacherUpdateRequestBodyType = updateTeacherRequest;

export type TeacherUpdateResponseBodyType =
  | updateTeacherSuccessResponse
  | CommonErrorResponse;

export type StudentFetchRequestBodyType = {
  searchKeyword: string;
  school_stage: string;
  grade: number;
  page: number;
  perPage: number;
};

export type StudentFetchResponseBodyType =
  | FetchStudentsSuccessResponse
  | CommonErrorResponse;

export type StudentCreateRequestBodyType = createStudentPayload;

export type StudentCreateResponseBodyType = Student;

export type StudentUpdatePathParams = {
  id: string;
};

export type StudentUpdateRequestBodyType = editStudentPayload;

export type StudentUpdateResponseBodyType = Student | CommonErrorResponse;

export type StudentDeletePathParams = {
  id: string;
};

export type StudentDeleteResponseBodyType = never | CommonErrorResponse;

export type StudentDetailPathParams = {
  id: string;
};

export type StudentDetailResponseBodyType = StudentDetail | CommonErrorResponse;

export type LessonNoteFetchRequestBodyType = LessonNoteListFilters;

export type LessonNoteFetchResponseBodyType =
  | FetchLessonNotesResponse
  | CommonErrorResponse;

export type LessonNoteCreateRequestBodyType = LessonNoteCreateRequest;
export type LessonNoteCreateResponseBodyType =
  | lessonNoteType
  | CommonErrorResponse;

export type LessonNoteDeletePathParams = {
  id: string;
};
export type LessonNoteDeleteRequestBodyType = { student_id: number };
export type LessonNoteDeleteResponseBodyType = never | CommonErrorResponse;

export type LessonNoteUpdatePathParams = {
  id: string;
};

export type LessonNoteUpdateRequestBodyType = LessonNoteUpdateRequest;
export type LessonNoteUpdateResponseBodyType =
  | lessonNoteType
  | CommonErrorResponse;

export type StudentTraitsRequestBodyType = StudentTraitListFilters;

export type StudentTraitsResponseBodyType =
  | FetchStudentTraitsResponse
  | CommonErrorResponse;
