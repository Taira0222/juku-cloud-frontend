import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { SignUpForm } from '@/features/auth/components/SignUpForm/SignUpForm';
import userEvent from '@testing-library/user-event';

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
