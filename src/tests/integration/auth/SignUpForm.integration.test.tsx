import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { SignUpForm } from '@/features/auth/components/SignUpForm/SignUpForm';
import userEvent from '@testing-library/user-event';
import { SignUpPage } from '@/pages/auth/SignUpPage';

// テスト用のコンポーネント
const ConfirmationSent = () => (
  <div data-testid="confirmation-sent">Confirmation Sent Page</div>
);

describe('SignUpForm component unit tests', () => {
  test('renders SignUpForm component with all form fields', () => {
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const schoolCodeInput = screen.getByPlaceholderText('例: 123456');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmationInput).toBeInTheDocument();
    expect(schoolCodeInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('password visibility toggle works correctly', async () => {
    // ユーザーイベントをセットアップ
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
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

describe('SignUpForm component integration tests', () => {
  test('successfully signs up when all fields are valid', async () => {
    render(
      <MemoryRouter initialEntries={['/sign_up']}>
        <Routes>
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route
            path="/sign_up/confirmation_sent"
            element={<ConfirmationSent />}
          />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const schoolCodeInput = screen.getByPlaceholderText('例: 123456');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    await user.type(nameInput, '山田 太郎');
    await user.type(emailInput, 'm@example.com');
    await user.type(passwordInput, 'password');
    await user.type(passwordConfirmationInput, 'password');
    await user.type(schoolCodeInput, '123456');

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
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('山田 太郎');
    const emailInput = screen.getByPlaceholderText('m@example.com');
    const passwordInput = screen.getByLabelText('パスワード');
    const passwordConfirmationInput = screen.getByLabelText('パスワード確認');
    const schoolCodeInput = screen.getByPlaceholderText('例: 123456');
    const submitButton = screen.getByRole('button', { name: '新規登録' });

    await user.type(nameInput, '山田 太郎');
    await user.type(emailInput, 'duplicate@example.com');
    await user.type(passwordInput, 'pass');
    await user.type(passwordConfirmationInput, 'word');
    await user.type(schoolCodeInput, 'InvalidCode');

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
      expect(screen.getByText('学校コードが無効です。')).toBeInTheDocument();
    });
  });
});
