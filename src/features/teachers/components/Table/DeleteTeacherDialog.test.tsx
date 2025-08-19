import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DeleteTeacherDialog } from './DeleteTeacherDialog';
import { useTeacherDelete } from '../../hooks/Table/useTeacherDelete';
import userEvent from '@testing-library/user-event';
import { Toaster } from '@/components/ui/feedback/Sonner/sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
  teacherName: string;
  refetch: () => Promise<void>;
};

vi.mock('../../hooks/Table/useTeacherDelete', () => ({
  useTeacherDelete: vi.fn(),
}));

describe('DeleteTeacherDialog', () => {
  const mockRender = (props: Props) => {
    return render(
      <>
        <Toaster position="top-right" />
        <DeleteTeacherDialog {...props} />
      </>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeacherDelete).mockReturnValue({
      error: null,
      loading: false,
      deleteTeacher: vi.fn().mockResolvedValue({ ok: true }),
    });

    const mockProps: Props = {
      // 開いた状態からテスト開始する
      open: true,
      onOpenChange: vi.fn(),
      teacherId: 1,
      teacherName: 'John Doe',
      refetch: vi.fn(),
    };

    mockRender(mockProps);

    expect(screen.getByText('この操作は取り消せません。')).toBeInTheDocument();
    expect(
      screen.getByText(
        `削除する場合は「${mockProps.teacherName}」と入力してください`
      )
    ).toBeInTheDocument();

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${mockProps.teacherName}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, 'John Doe');
    await user.click(deleteButton);

    expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
    expect(mockProps.refetch).toHaveBeenCalled();
    expect(screen.getByText('講師を削除しました。')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeacherDelete).mockReturnValue({
      error: '予期せぬエラーが発生しました。',
      loading: false,
      deleteTeacher: vi.fn().mockResolvedValue({ ok: false }),
    });

    const mockProps: Props = {
      open: true,
      onOpenChange: vi.fn(),
      teacherId: 1,
      teacherName: 'John Doe',
      refetch: vi.fn(),
    };

    mockRender(mockProps);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${mockProps.teacherName}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, 'John Doe');
    await user.click(deleteButton);

    expect(mockProps.refetch).not.toHaveBeenCalled();
    expect(mockProps.onOpenChange).not.toHaveBeenCalled();
    // error の表示
    expect(
      screen.getByText('予期せぬエラーが発生しました。')
    ).toBeInTheDocument();
    // toast の表示
    expect(screen.getByText('講師の削除に失敗しました。')).toBeInTheDocument();
  });
  test('handles loading state', async () => {
    vi.mocked(useTeacherDelete).mockReturnValue({
      error: null,
      loading: true,
      deleteTeacher: vi.fn(),
    });

    const mockProps: Props = {
      open: true,
      onOpenChange: vi.fn(),
      teacherId: 1,
      teacherName: 'John Doe',
      refetch: vi.fn(),
    };

    mockRender(mockProps);

    // ローディング状態の確認のみ
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('読み込み中')).toBeInTheDocument(); // DialogTitleの内容

    // Input要素が存在しないことを確認
    expect(screen.queryByLabelText('確認入力')).not.toBeInTheDocument();

    // 削除ボタンが存在しないことを確認
    expect(
      screen.queryByRole('button', {
        name: `講師「${mockProps.teacherName}」を削除する`,
      })
    ).not.toBeInTheDocument();
  });

  test('does not match teacher name', async () => {
    const user = userEvent.setup();
    vi.mocked(useTeacherDelete).mockReturnValue({
      error: null,
      loading: false,
      deleteTeacher: vi.fn().mockResolvedValue({ ok: false }),
    });

    const mockProps: Props = {
      open: true,
      onOpenChange: vi.fn(),
      teacherId: 1,
      teacherName: 'John Doe',
      refetch: vi.fn(),
    };

    mockRender(mockProps);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${mockProps.teacherName}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, 'another name');
    await user.click(deleteButton);

    expect(mockProps.refetch).not.toHaveBeenCalled();
    expect(mockProps.onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('名前が一致しません。')).toBeInTheDocument();
  });
});
