import { getErrorMessage } from '@/lib/errors/getErrorMessage';
import { describe, expect, test } from 'vitest';
import { ZodError } from 'zod';

describe('getErrorMessage', () => {
  test('should return empty string for null input', () => {
    const input = null;
    const expectedOutput = ['無効なエラー'];
    const result = getErrorMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  test('should return axiosError message for AxiosError error input', () => {
    const input = {
      isAxiosError: true,
      response: {
        data: {
          error: 'NotFound',
        },
        status: 404,
      },
    };
    const expectedOutput = ['NotFound'];
    const result = getErrorMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  test('should return axiosError message for AxiosError errors input', () => {
    const input = {
      isAxiosError: true,
      response: {
        data: {
          errors: [{ code: 'INVALID_REQUEST', message: 'invalid request' }],
        },
        status: 422,
      },
    };
    const expectedOutput = ['invalid request'];
    const result = getErrorMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  test('should return ZodError message for ZodError input', () => {
    const input = new ZodError([
      {
        message: 'Invalid input',
        path: ['name'],
        code: 'invalid_type',
        expected: 'string',
      },
    ]);
    const expectedOutput = ['データ形式が不正です'];
    const result = getErrorMessage(input);
    expect(result).toEqual(expectedOutput);
  });

  test('should return communication error message for other error input', () => {
    const input = new Error('Communication error');
    const expectedOutput = ['通信エラーが発生しました。'];
    const result = getErrorMessage(input);
    expect(result).toEqual(expectedOutput);
  });
});
