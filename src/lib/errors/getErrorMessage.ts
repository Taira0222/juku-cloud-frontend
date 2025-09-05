import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

type Errors = {
  code: string;
  field?: string;
  message: string;
};

type CommonServerError = {
  // api.ts で401/403/404/500 エラー処理はするが、念のため error フィールドは定義しておく
  error?: string;
  errors?: Errors[]; // 400/422 の配列
};

export const getErrorMessage = (error: unknown): string[] => {
  if (!error) return ['無効なエラー'];

  // axiosError
  if (isAxiosError<CommonServerError>(error)) {
    const response = error.response?.data;
    const status = error.response?.status;

    if (typeof status === 'number') {
      if ([401, 403, 404, 500].includes(status)) {
        return [response?.error || '予期せぬエラーが発生しました。'];
      } else if ([400, 422].includes(status)) {
        return (
          response?.errors?.map((error) => error.message) || [
            '予期せぬエラーが発生しました。',
          ]
        );
      }
    }
  }

  // ZodError
  if (error instanceof ZodError) {
    return ['データ形式が不正です'];
  }
  // 通信エラーなど
  return ['通信エラーが発生しました。'];
};
