import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { server } from '@/tests/mocks/server';

// 学校名
const SCHOOL_NAME = 'First_school';

// テスト用のコンポーネント
const ConfirmationSent = () => (
  <div data-testid="confirmation-sent">Confirmation Sent Page</div>
);
const NotFoundPage = () => <div data-testid="not-found">Not Found Page</div>;

describe('SignUp integration tests', () => {
  let seen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    seen = vi.fn();
    server.events.removeAllListeners('request:match');

    server.events.on('request:match', ({ request }) => {
      // 例: "/api/v1/invites/123456" or "http://.../api/v1/invites/123456?x=y"
      const m = request.url.match(/\/api\/v1\/invites\/([^/?#]+)/);
      if (m) seen(m[1]); // m[1] が token
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    server.events.removeAllListeners('request:match');
  });

  test('successfully signs up when all fields are valid', async () => {
    render(
      <MemoryRouter initialEntries={['/sign_up?token=123456']}>
        <Routes>
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route
            path="/sign_up/confirmation_sent"
            element={<ConfirmationSent />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Juku Cloud')).toBeInTheDocument();
      expect(screen.getByText(`${SCHOOL_NAME}へようこそ`)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(seen).toHaveBeenCalled(); // 呼ばれたか？
      expect(seen).toHaveBeenCalledWith('123456'); // 引数が正しいか？
      expect(seen).toHaveBeenCalledTimes(1); // 回数が正しいか？
    });

    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    await user.type(nameInput, '山田 太郎');
    await user.type(emailInput, 'm@example.com');
    await user.type(passwordInput, 'password');
    await user.type(passwordConfirmationInput, 'password');

    // ボタンをクリックして送信
    user.click(submitButton);
    // 送信中の状態確認
    await waitFor(() => {
      expect(screen.getByText('登録中...')).toBeInTheDocument();
    });

    // ページ遷移の確認
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-sent')).toBeInTheDocument();
    });
  });

  test('shows error message when sign up fails', async () => {
    render(
      <MemoryRouter initialEntries={['/sign_up?token=123456']}>
        <SignUpPage />
        <ConfirmationSent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Juku Cloud')).toBeInTheDocument();
      expect(screen.getByText(`${SCHOOL_NAME}へようこそ`)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(seen).toHaveBeenCalled(); // 呼ばれたか？
      expect(seen).toHaveBeenCalledWith('123456'); // 引数が正しいか？
    });

    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    await user.type(nameInput, '山田 太郎');
    await user.type(emailInput, 'duplicate@example.com');
    await user.type(passwordInput, 'pass');
    await user.type(passwordConfirmationInput, 'word');

    // ボタンをクリックして送信
    user.click(submitButton);
    // 送信中の状態確認
    await waitFor(() => {
      expect(screen.getByText('登録中...')).toBeInTheDocument();
    });

    // エラーメッセージの確認
    await waitFor(() => {
      expect(
        screen.getByText('メールアドレスはすでに使用されています。')
      ).toBeInTheDocument();
      expect(
        screen.getByText('パスワードは6文字以上で入力してください。')
      ).toBeInTheDocument();
      expect(
        screen.getByText('パスワードが一致しません。')
      ).toBeInTheDocument();
    });
  });

  test('shows error message when wrong token', async () => {
    render(
      <MemoryRouter initialEntries={['/sign_up?token=24680']}>
        <SignUpPage />
        <NotFoundPage />
      </MemoryRouter>
    );
    // ページ遷移の確認
    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(seen).toHaveBeenCalled(); // 呼ばれたか？
      expect(seen).toHaveBeenCalledWith('24680'); // 引数が正しいか？
    });
  });
});
