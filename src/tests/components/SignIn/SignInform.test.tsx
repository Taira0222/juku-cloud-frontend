import { beforeEach, describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useAuthStore } from '@/stores/authStore';
import { SignIn } from '@/components/SignIn/SignIn';
import { act } from 'react';

// テスト用のコンポーネント
const StudentManagement = () => (
  <div data-testid="student-management">Student Management Page</div>
);

beforeEach(() => {
  // 認証ストアを初期化
  useAuthStore.getState().clearAuth();
});

describe('SignIn form unit tests', () => {
  test('renders sign in form with email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <SignIn />
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

describe('SignIn form integration tests', () => {
  test('successfully signs in when email and password are correct', async () => {
    render(
      <MemoryRouter initialEntries={['/sign_in']}>
        <Routes>
          <Route path="/sign_in" element={<SignIn />} />
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
        expiry: '1754694561',
      });
    });

    // ページ遷移の確認
    await waitFor(() => {
      expect(screen.getByTestId('student-management')).toBeInTheDocument();
    });

    act(() => {
      window.history.back();
    });
    // 戻るボタンを押してもstudent-management にとどまることを確認
    await waitFor(() => {
      expect(screen.getByTestId('student-management')).toBeInTheDocument();
    });
  });

  test('shows error message when email or password is incorrect', async () => {
    render(
      <MemoryRouter>
        <SignIn />
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
      expect(auth).toEqual(null);
    });

    // エラーメッセージが表示されていることを確認
    expect(
      screen.getByText('ログインに失敗しました。もう一度お試しください。')
    ).toBeInTheDocument();
  });
});
