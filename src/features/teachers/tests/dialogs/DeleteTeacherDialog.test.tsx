import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useTeacherDelete } from '../../mutations/useTeacherDelete';
import userEvent from '@testing-library/user-event';
import { Toaster } from '@/components/ui/feedback/Sonner/sonner';
import { useTeachersStore } from '@/stores/teachersStore';

import { DeleteTeacherDialog } from '../../components/dialogs/DeleteTeacherDialog';
import { teacher1 } from '../../../../tests/fixtures/teachers/teachers';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: number;
};

vi.mock('../../mutations/useTeacherDelete', () => ({
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
    vi.spyOn(useTeachersStore.getState(), 'deleteTeacherLocal');
    vi.spyOn(useTeachersStore.getState(), 'getTeacherData');
    useTeachersStore.setState({
      detailDrawer: [teacher1],
    });
  });

  test('renders correctly', async () => {
    const deleteTeacherLocalMock = vi.spyOn(
      useTeachersStore.getState(),
      'deleteTeacherLocal'
    );
    const getTeacherDataMock = vi.spyOn(
      useTeachersStore.getState(),
      'getTeacherData'
    );
    const user = userEvent.setup();

    vi.mocked(useTeacherDelete).mockReturnValue({
      error: null,
      loading: false,
      deleteTeacher: vi.fn().mockResolvedValue({ ok: true }),
    });

    useTeachersStore.setState({
      detailDrawer: [teacher1],
    });

    const mockProps: Props = {
      // teacher1 のid は2
      open: true,
      onOpenChange: vi.fn(),
      teacherId: 2,
    };

    mockRender(mockProps);

    expect(getTeacherDataMock).toHaveBeenCalledWith(mockProps.teacherId);
    expect(screen.getByText('この操作は取り消せません。')).toBeInTheDocument();
    expect(
      screen.getByText(`削除する場合は「${teacher1.name}」と入力してください`)
    ).toBeInTheDocument();

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${teacher1.name}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, teacher1.name);
    await user.click(deleteButton);

    expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('講師を削除しました。')).toBeInTheDocument();
    expect(deleteTeacherLocalMock).toHaveBeenCalledWith(mockProps.teacherId);
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
      teacherId: 2,
    };

    mockRender(mockProps);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${teacher1.name}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, teacher1.name);
    await user.click(deleteButton);

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
      teacherId: 2,
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
        name: `講師「${teacher1.name}」を削除する`,
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
      teacherId: 2,
    };

    mockRender(mockProps);

    const inputTeacherName = screen.getByLabelText('確認入力');
    const deleteButton = screen.getByRole('button', {
      name: `講師「${teacher1.name}」を削除する`,
    });

    // 講師の名前を入力し削除
    await user.type(inputTeacherName, 'another name');
    await user.click(deleteButton);

    expect(mockProps.onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText('名前が一致しません。')).toBeInTheDocument();
  });
});
