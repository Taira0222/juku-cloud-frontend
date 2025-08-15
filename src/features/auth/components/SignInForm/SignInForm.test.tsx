import { beforeEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignInForm } from './SignInForm';
import { useWarningStore } from '@/stores/warningStore';

describe('SignIn Form tests', () => {
  // warningMessage をセットしておく
  beforeEach(() => {
    useWarningStore.setState({ warningMessage: '' });
  });
  test('renders SignIn component', () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    const title = screen.getByText('アカウントにログイン');

    expect(title).toBeInTheDocument();

    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });
    const signUpMessage = screen.getByText(
      '管理者から招待を受けてからご利用ください'
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(signUpMessage).toBeInTheDocument();
  });

  test('renders warningMessage if you try to move signed in pages without sign in', () => {
    useWarningStore.setState({ warningMessage: 'ログインが必要です' });

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );
    const warningMessage = screen.getByText('ログインが必要です');
    expect(warningMessage).toBeInTheDocument();
  });
});
