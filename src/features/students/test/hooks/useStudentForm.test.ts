import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  INITIAL_DRAFT,
  INITIAL_ERROR_MESSAGES,
  useStudentForm,
} from '../../hooks/useStudentForm';
import { act, renderHook } from '@testing-library/react';
import {
  createStudentMockPayload,
  editStudentMockPayload,
} from '@/tests/fixtures/students/students';

describe('useStudentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should initialize form state correctly for create mode', () => {
    const { result } = renderHook(() => useStudentForm('create'));

    const { value, setValue, submit, reset } = result.current;

    expect(value).toEqual(INITIAL_DRAFT);
    expect(typeof setValue).toBe('function');
    expect(typeof submit).toBe('function');
    expect(typeof reset).toBe('function');
  });
  test('should initialize form state correctly for edit mode with initial data', () => {
    const initialData = {
      ...editStudentMockPayload,
    };

    const { result } = renderHook(() => useStudentForm('edit', initialData));

    const { value } = result.current;
    expect(value).toEqual(initialData);
  });
  test('should call new Error for invalid initial data', () => {
    // 強制的に型を外して不正なフィールドを追加
    const initialData = {
      ...createStudentMockPayload,
      id: 'not-a-number', // number型ではない不正なidを追加
    } as unknown as typeof editStudentMockPayload;

    expect(() => {
      renderHook(() => useStudentForm('edit', initialData));
    }).toThrow(INITIAL_ERROR_MESSAGES);
  });

  test('should call new Error for missing initial data in edit mode', () => {
    expect(() => {
      renderHook(() => useStudentForm('edit'));
    }).toThrow(INITIAL_ERROR_MESSAGES);
  });

  test('submit should validate and return correct payload for create mode', () => {
    const { result } = renderHook(() => useStudentForm('create'));

    act(() => {
      result.current.setValue(createStudentMockPayload);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith(createStudentMockPayload);
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(INITIAL_DRAFT);
  });

  test('submit should call onInvalid for invalid data for create mode', () => {
    const { result } = renderHook(() => useStudentForm('create'));

    const overName = 'a'.repeat(51); // nameの最大長は50
    act(() => {
      result.current.setValue({ ...createStudentMockPayload, name: overName });
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(false);
    expect(onValidSpy).not.toHaveBeenCalled();
    expect(onInvalidSpy).toHaveBeenCalledWith([
      '生徒名は50文字以内で入力してください',
    ]);
  });

  test('submit should validate and return correct payload for edit mode', () => {
    const initialData = {
      ...editStudentMockPayload,
    };
    const { result } = renderHook(() => useStudentForm('edit', initialData));

    act(() => {
      result.current.setValue(editStudentMockPayload);
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(true);
    expect(onValidSpy).toHaveBeenCalledWith(editStudentMockPayload);
    expect(onInvalidSpy).not.toHaveBeenCalled();
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toEqual(initialData);
    expect(result.current.value.id).toBe(initialData.id);
  });

  test('submit should call onInvalid for invalid data for edit mode', () => {
    const initialData = {
      ...editStudentMockPayload,
    };
    const { result } = renderHook(() => useStudentForm('edit', initialData));

    const invalidId = -1; // idは正の数
    act(() => {
      result.current.setValue({ ...editStudentMockPayload, id: invalidId });
    });

    const onValidSpy = vi.fn();
    const onInvalidSpy = vi.fn();

    const submitResult = result.current.submit(onValidSpy, onInvalidSpy);
    expect(submitResult).toBe(false);
    expect(onValidSpy).not.toHaveBeenCalled();
    expect(onInvalidSpy).toHaveBeenCalledWith([
      '生徒IDは正の数である必要があります',
    ]);
  });
});
