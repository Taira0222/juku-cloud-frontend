import { beforeEach, expect, test, vi } from 'vitest';
import { describe } from 'vitest';

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { useFetchInviteToken } from '../../queries/useFetchInviteToken';
import { CreateDialog } from '../../components/dialogs/CreateDialog';

vi.mock('@/features/teachers/queries/useFetchInviteToken', () => ({
  useFetchInviteToken: vi.fn(),
}));

const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;

describe('CreateDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render the dialog and handle copy action', async () => {
    const refetch = vi.fn();
    const reset = vi.fn();
    const user = userEvent.setup({ writeToClipboard: true });
    const mockInviteUrl = `${FRONTEND_BASE_URL}/sign_up?token=valid_token`;

    // すでに存在するobject をモック化するためのメソッド
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);

    vi.mocked(useFetchInviteToken).mockReturnValue({
      inviteToken: { token: 'valid_token' },
      error: null,
      loading: false,
      refetch,
      reset,
    });

    render(<CreateDialog />);

    const addTeachersButton = screen.getByRole('button', {
      name: '講師の追加',
    });

    expect(addTeachersButton).toBeInTheDocument();
    // 講師を追加をクリックする
    await user.click(addTeachersButton);

    // Dialog が表示される
    const input = await screen.findByLabelText('招待URL');

    expect(refetch).toHaveBeenCalled();
    expect(screen.getByText('招待リンクを共有')).toBeInTheDocument();
    expect(input).toHaveValue(mockInviteUrl);

    const copyButton = screen.getByRole('button', { name: 'コピー' });
    expect(copyButton).toBeInTheDocument();

    // URLをコピーする
    await user.click(copyButton);

    const successMessage = await screen.findByText('コピーしました。');
    expect(successMessage).toBeInTheDocument();

    // クリップボードへの書き込みが呼び出されたことを確認
    expect(writeTextSpy).toHaveBeenCalledTimes(1);
    expect(writeTextSpy).toHaveBeenCalledWith(mockInviteUrl);

    // 閉じるボタンをクリック
    const closeButton = screen.getByRole('button', { name: '閉じる' });
    await user.click(closeButton);

    await screen.findByText('講師の追加');
    expect(reset).toHaveBeenCalled();
  });

  test('render error when useFetchInviteToken returns an error', async () => {
    const user = userEvent.setup();
    const mockError = 'Failed to fetch invite token';

    vi.mocked(useFetchInviteToken).mockReturnValue({
      inviteToken: null,
      loading: false,
      error: mockError,
      refetch: vi.fn(),
      reset: vi.fn(),
    });

    render(<CreateDialog />);

    const addTeachersButton = screen.getByRole('button', {
      name: '講師の追加',
    });
    await user.click(addTeachersButton);
    expect(screen.getByText('エラー')).toBeInTheDocument();
    expect(
      screen.getByText('エラーが発生しました。内容を確認してください。')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Failed to fetch invite token')
    ).toBeInTheDocument();
  });
  test('should handle loading state', async () => {
    const user = userEvent.setup();

    vi.mocked(useFetchInviteToken).mockReturnValue({
      inviteToken: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
      reset: vi.fn(),
    });

    render(<CreateDialog />);

    const addTeachersButton = screen.getByRole('button', {
      name: '講師の追加',
    });
    await user.click(addTeachersButton);
    expect(screen.getByText('読み込み中')).toBeInTheDocument();
    expect(screen.getByText('データを読み込んでいます…')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
