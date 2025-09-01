import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

type CommonServerError = {
  error?: string; // 401/403/404/500 など
  errors?: string[]; // 400/422 の配列
};

export const getErrorMessage = (error: unknown): string => {
  if (!error) return '';

  // axiosError
  if (isAxiosError<CommonServerError>(error)) {
    return error.response?.data?.error ?? '予期せぬエラーが発生しました。';
  }
  // ZodError
  if (error instanceof ZodError) {
    return 'データ形式が不正です';
  }
  // 予期せぬエラー
  return '予期せぬエラーが発生しました。';
};
