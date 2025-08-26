import type {
  SignInErrorResponse,
  SignInSuccessResponse,
} from '@/features/auth/types/auth';
import type {
  SignUpErrorResponse,
  SignUpSuccessResponse,
} from '@/features/auth/types/signUp';
import type {
  TokenConfirmErrorResponse,
  TokenConfirmSuccessResponse,
} from '@/features/auth/types/tokenConfirm';
import type {
  InviteTokenErrorResponse,
  InviteTokenSuccessResponse,
} from '@/features/teachers/types/inviteToken';
import type {
  fetchTeachersErrorResponse,
  fetchTeachersSuccessResponse,
} from '@/features/teachers/types/teachers';

// サインインの型定義
export type SignInPathParams = Record<string, string | undefined>;

export type SignInRequestBodyType = {
  email: string;
  password: string;
};

export type SignInResponseBodyType =
  | SignInSuccessResponse
  | SignInErrorResponse;

// サインアップの型定義
export type SignUpPathParams = Record<string, string | undefined>;

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
  | fetchTeachersErrorResponse;

// 講師作成トークンの型定義

export type InviteTokenCreateResponseBodyType =
  | InviteTokenSuccessResponse
  | InviteTokenErrorResponse;

// トークン確認の型定義
export type TokenConfirmPathParams = {
  token: string;
};
// リクエストボディは今回不要
export type TokenConfirmRequestBodyType = undefined;

export type TokenConfirmResponseBodyType =
  | TokenConfirmSuccessResponse
  | TokenConfirmErrorResponse;
