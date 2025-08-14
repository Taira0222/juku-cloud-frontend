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

// トークン確認の型定義
export type TokenConfirmPathParams = {
  token: string;
};
// リクエストボディは今回不要
export type TokenConfirmRequestBodyType = undefined;

export type TokenConfirmResponseBodyType =
  | TokenConfirmSuccessResponse
  | TokenConfirmErrorResponse;
