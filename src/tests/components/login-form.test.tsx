import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/Home/login-form';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useAuthStore } from '@/stores/authStore';

// テスト用のコンポーネント
const StudentManagement = () => (
  <div data-testid="student-management">Student Management Page</div>
);

describe('LoginForm unit tests', () => {
  test('renders login form with email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});

describe('LoginForm integration tests', () => {
  test('confirm login when email and password are correct', async () => {
    useAuthStore.getState().clearAuth();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/student_management" element={<StudentManagement />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const inputEmailElement = screen.getByPlaceholderText('m@example.com');
    const inputPasswordElement = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(inputEmailElement, 'test@example.com');
    await user.type(inputPasswordElement, 'password123');
    await user.click(submitButton);

    // 認証状態の確認
    await waitFor(() => {
      const auth = useAuthStore.getState().auth;
      expect(auth).toEqual({
        'access-token': 'fake-access-token',
        client: 'fake-client',
        uid: 'fake-uid',
        'token-type': 'Bearer',
      });
    });

    // ページ遷移の確認
    await waitFor(() => {
      expect(screen.getByTestId('student-management')).toBeInTheDocument();
    });
  });

  test('shows error message when email or password is incorrect', async () => {
    useAuthStore.getState().clearAuth();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const inputEmailElement = screen.getByPlaceholderText('m@example.com');
    const inputPasswordElement = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    await user.type(inputEmailElement, 'wrong@example.com');
    await user.type(inputPasswordElement, 'wrongpassword');
    await user.click(submitButton);

    // 認証状態の確認
    await waitFor(() => {
      const auth = useAuthStore.getState().auth;
      expect(auth).toEqual(undefined);
    });

    // エラーメッセージが表示されていることを確認
    expect(
      screen.getByText('ログインに失敗しました。もう一度お試しください。')
    ).toBeInTheDocument();
  });
});
