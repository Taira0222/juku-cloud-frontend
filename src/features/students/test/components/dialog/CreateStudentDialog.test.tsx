import { Toaster } from '@/components/ui/feedback/Sonner/sonner';
import { CreateStudentDialog } from '@/features/students/components/dialog/CreateStudentDialog';
import { useStudentForm } from '@/features/students/hooks/useStudentForm';
import { useTeachersForStudent } from '@/features/students/hooks/useTeachersForStudent';
import { useCreateStudentMutation } from '@/features/students/mutations/useCreateStudentMutation';
import type { createStudentPayload } from '@/features/students/types/students';
import {
  createStudentMockPayload,
  initialMockValue,
  mockTeachers,
} from '@/tests/fixtures/students/students';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const wrapper = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CreateStudentDialog />
    </QueryClientProvider>
  );
};

vi.mock('@/features/students/hooks/useTeachersForStudent', () => ({
  useTeachersForStudent: vi.fn(),
}));

vi.mock('@/features/students/mutations/useCreateStudentMutation', () => ({
  useCreateStudentMutation: vi.fn(),
}));

vi.mock('@/features/students/hooks/useStudentForm', () => ({
  useStudentForm: vi.fn(),
}));

describe('CreateStudentDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
  test('should open and close the dialog correctly and reset the form', async () => {
    const user = userEvent.setup();
    const mockSetValue = vi.fn();
    const mockReset = vi.fn();

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: initialMockValue,
      setValue: mockSetValue,
      submit: vi.fn(),
      reset: mockReset,
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/生徒の名前/);
    await user.type(nameInput, 'Test Student');
    expect(mockSetValue).toHaveBeenCalled();

    // ダイアログを閉じる

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    expect(mockReset).toHaveBeenCalled();
  });

  test('should call mutate when form is submitted', async () => {
    const user = userEvent.setup();
    const mockMutate = vi.fn();
    const mockReset = vi.fn();
    // 成功を返す
    const mockSubmit = vi.fn(
      (
        onValid: (data: createStudentPayload) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(createStudentMockPayload);
        onInvalid?.([]);
        return true;
      }
    );

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: createStudentMockPayload,
      setValue: vi.fn(),
      submit: mockSubmit,
      reset: mockReset,
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: '作成' });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith(createStudentMockPayload);

    expect(mockReset).toHaveBeenCalled();
  });

  test('should display error message when form is invalid', async () => {
    const user = userEvent.setup();
    // 失敗を返す
    const mockSubmit = vi.fn(
      (
        onValid: (data: createStudentPayload) => void,
        onInvalid?: (msgs: string[]) => void
      ) => {
        onValid(createStudentMockPayload);
        onInvalid?.(['生徒名は50文字以内で入力してください']);
        return false;
      }
    );

    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: { ...createStudentMockPayload, name: 'a'.repeat(51) }, // 名前が51文字の無効なデータ
      setValue: vi.fn(),
      submit: mockSubmit,
      reset: vi.fn(),
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: '作成' });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);
    expect(mockSubmit).toHaveBeenCalled();
    expect(
      screen.getByText('生徒名は50文字以内で入力してください')
    ).toBeInTheDocument();
  });

  test('should display loading state when fetching teachers', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: true,
      error: null,
      teachers: [],
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: initialMockValue,
      setValue: vi.fn(),
      submit: vi.fn(),
      reset: vi.fn(),
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    // ローディング表示を確認
    expect(screen.getByText('講師情報を読み込み中...')).toBeInTheDocument();
  });

  test('should display error state when fetching teachers fails', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: '講師の情報の取得に失敗しました。',
      teachers: [],
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: initialMockValue,
      setValue: vi.fn(),
      submit: vi.fn(),
      reset: vi.fn(),
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    // エラー表示を確認
    expect(
      screen.getByText('講師の情報の取得に失敗しました。')
    ).toBeInTheDocument();
  });

  test('should disable submit button when mutation is pending', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeachersForStudent).mockReturnValue({
      loading: false,
      error: null,
      teachers: [mockTeachers[0], mockTeachers[1]], // Teacher1, Teacher2
    });

    vi.mocked(useCreateStudentMutation).mockReturnValue({
      isPending: true, // ミューテーションが保留中
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useCreateStudentMutation>);

    vi.mocked(useStudentForm).mockReturnValue({
      value: initialMockValue,
      setValue: vi.fn(),
      submit: vi.fn(),
      reset: vi.fn(),
    });

    wrapper();

    const openButton = screen.getByRole('button', { name: /生徒の追加/ });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByText('生徒を新規作成')).toBeInTheDocument();
    expect(
      screen.getByText('生徒の基本情報を入力してください。')
    ).toBeInTheDocument();

    expect(screen.getByText('生徒情報を作成中...')).toBeInTheDocument();
  });
});
