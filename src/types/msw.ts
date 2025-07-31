import type { LoginErrorResponse, LoginSuccessResponse } from './auth';
import type { SignUpErrorResponse, SignUpSuccessResponse } from './signUp';

// サインインの型定義
export type LoginPathParams = Record<string, string | undefined>;

export type LoginRequestBodyType = {
  email: string;
  password: string;
};

export type LoginResponseBodyType = LoginSuccessResponse | LoginErrorResponse;

// サインアップの型定義
export type SignUpPathParams = Record<string, string | undefined>;

export type SignUpRequestBodyType = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_code: string;
};

export type SignUpResponseBodyType =
  | SignUpSuccessResponse
  | SignUpErrorResponse;
