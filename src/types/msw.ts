import type { LoginErrorResponse, LoginSuccessResponse } from './auth';

export type LoginPathParams = Record<string, string | undefined>;

export type LoginRequestBodyType = {
  email: string;
  password: string;
};

export type LoginResponseBodyType = LoginSuccessResponse | LoginErrorResponse;
