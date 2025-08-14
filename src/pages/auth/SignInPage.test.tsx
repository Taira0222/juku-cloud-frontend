import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignInPage } from '@/pages/auth/SignInPage';

describe('SignIn component unit tests', () => {
  test('renders SignIn component with logo and title', () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    // Juku Cloud が表示されていることを確認

    const title = screen.getByText('Juku Cloud');
    expect(title).toBeInTheDocument();
  });
  test('renders sign in form with email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <SignInPage />
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
