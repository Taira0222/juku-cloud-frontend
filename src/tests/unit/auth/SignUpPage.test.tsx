// __tests__/SignUpPage.test.tsx
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import userEvent from '@testing-library/user-event';

// モジュール全体を vi.fn() に差し替える
vi.mock('@/features/auth/hooks/useTokenConfirm', () => ({
  useTokenConfirm: vi.fn(),
}));

// 差し替わったuseTokenConfirm のモックをインポート
import { useTokenConfirm } from '@/features/auth/hooks/useTokenConfirm';
const mockedUseTokenConfirm = vi.mocked(useTokenConfirm);

beforeEach(() => {
  vi.clearAllMocks();
});

//テスト用: NotFoundPageコンポーネントのダミー実装
const NotFoundPage = () => <div data-testid="not-found">Not Found Page</div>;
// 学校名
const SCHOOL_NAME = 'First_school';

describe('SignUp component', () => {
  test('switch loading → success screen', async () => {
    // 最初はローディングを返す
    mockedUseTokenConfirm.mockReturnValue({
      loading: true,
      tokenError: null,
      data: null,
    });

    const ui = (
      <MemoryRouter initialEntries={['/sign_up?token=123456']}>
        <SignUpPage />
      </MemoryRouter>
    );
    const { rerender } = render(ui);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 次のレンダーで成功に差し替え
    mockedUseTokenConfirm.mockReturnValue({
      loading: false,
      tokenError: null,
      data: { school_name: SCHOOL_NAME },
    });

    rerender(
      <MemoryRouter initialEntries={['/sign_up?token=123456']}>
        <SignUpPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Juku Cloud')).toBeInTheDocument();
      expect(screen.getByText(`${SCHOOL_NAME}へようこそ`)).toBeInTheDocument();
    });
  });

  test('エラー表示', async () => {
    mockedUseTokenConfirm.mockReturnValue({
      loading: false,
      tokenError: 'Invalid token',
      data: null,
    });

    render(
      <MemoryRouter initialEntries={['/sign_up?token=bad']}>
        <SignUpPage />
        <NotFoundPage />
      </MemoryRouter>
    );

    // NotFoundPage へ遷移
    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });
});

describe('SignUpForm component unit tests', () => {
  beforeEach(() => {
    mockedUseTokenConfirm.mockReturnValue({
      loading: false,
      tokenError: null,
      data: { school_name: SCHOOL_NAME },
    });

    render(
      <MemoryRouter initialEntries={['/sign_up?token=123456']}>
        <SignUpPage />
      </MemoryRouter>
    );
  });

  test('renders SignUpForm component with all form fields', () => {
    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmationInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('password visibility toggle works correctly', async () => {
    // ユーザーイベントをセットアップ
    const user = userEvent.setup();

    // aria-labelをgetByLabelTextで取得
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    // パスワード表示/非表示のトグルボタンを取得
    const toggleButton = screen.getByLabelText('パスワードを表示');
    const toggleConfirmationButton =
      screen.getByLabelText('パスワード確認を表示');

    // 初期状態ではパスワードは非表示
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordConfirmationInput).toHaveAttribute('type', 'password');

    // パスワード表示ボタンをクリック
    // await でユーザーイベントを待つ
    await user.click(toggleButton);
    await user.click(toggleConfirmationButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passwordConfirmationInput).toHaveAttribute('type', 'text');

    // 再度クリックして非表示に戻す
    // await でユーザーイベントを待つ
    await user.click(toggleButton);
    await user.click(toggleConfirmationButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordConfirmationInput).toHaveAttribute('type', 'password');
  });
});
