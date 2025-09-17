import type { SignInSuccessResponse } from "@/features/auth/types/auth";
import type {
  SignUpErrorResponse,
  SignUpSuccessResponse,
} from "@/features/auth/types/signUp";
import type { TokenConfirmSuccessResponse } from "@/features/auth/types/tokenConfirm";
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
