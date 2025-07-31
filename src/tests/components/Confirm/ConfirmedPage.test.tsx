// ConfirmedPage.test.tsx
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react';
import { ConfirmedPage } from '@/components/Confirm/ConfirmedPage';

// モックコンポーネント
const SignIn = () => <div data-testid="sign-in">Sign In Page</div>;
const SignUp = () => <div data-testid="sign-up">Sign Up Page</div>;
const Home = () => <div data-testid="home">Home Page</div>;

describe('ConfirmedPage component', () => {
  const renderWithRouter = (searchParams = '') => {
    return render(
      <MemoryRouter initialEntries={[`/confirmed${searchParams}`]}>
        <Routes>
          <Route path="/confirmed" element={<ConfirmedPage />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Success flow', () => {
    test('displays success state when account_confirmation_success=true', () => {
      renderWithRouter('?account_confirmation_success=true');

      expect(screen.getByText('アカウント確認完了')).toBeInTheDocument();
      expect(
        screen.getByText('アカウントが正常に確認されました')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ログインページへ' })
      ).toBeInTheDocument();
    });

    test('redirects to sign-in page after 10 seconds', () => {
      vi.useFakeTimers();
      renderWithRouter('?account_confirmation_success=true');

      expect(screen.getByText('アカウント確認完了')).toBeInTheDocument();
      expect(
        screen.getByText('10秒後にログインページに移動します')
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    });

    test('navigates to sign-in page when button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('?account_confirmation_success=true');

      const button = screen.getByRole('button', { name: 'ログインページへ' });
      await user.click(button);

      expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    });
  });

  describe('Failure flow', () => {
    test('displays failure state when account_confirmation_success=false', () => {
      renderWithRouter('?account_confirmation_success=false');

      expect(screen.getByText('アカウント確認失敗')).toBeInTheDocument();
      expect(
        screen.getByText(/確認リンクが無効または期限切れ/)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '会員登録ページへ' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ホームに戻る' })
      ).toBeInTheDocument();
    });

    test('redirects to sign-up page after 10 seconds', () => {
      vi.useFakeTimers();
      renderWithRouter('?account_confirmation_success=false');

      expect(
        screen.getByText('10秒後に会員登録ページに移動します')
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByTestId('sign-up')).toBeInTheDocument();
    });

    test('navigates to sign-up page when sign-up button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('?account_confirmation_success=false');

      const button = screen.getByRole('button', { name: '会員登録ページへ' });
      await user.click(button);

      expect(screen.getByTestId('sign-up')).toBeInTheDocument();
    });

    test('navigates to home page when home button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('?account_confirmation_success=false');

      const button = screen.getByRole('button', { name: 'ホームに戻る' });
      await user.click(button);

      expect(screen.getByTestId('home')).toBeInTheDocument();
    });
  });

  describe('Default behavior', () => {
    test('treats missing parameter as failure', () => {
      renderWithRouter(); // パラメータなし

      expect(screen.getByText('アカウント確認失敗')).toBeInTheDocument();
    });

    test('treats invalid parameter as failure', () => {
      renderWithRouter('?account_confirmation_success=invalid');

      expect(screen.getByText('アカウント確認失敗')).toBeInTheDocument();
    });
  });

  describe('Timer functionality', () => {
    test('countdown decreases correctly', () => {
      vi.useFakeTimers();
      renderWithRouter('?account_confirmation_success=true');

      expect(
        screen.getByText('10秒後にログインページに移動します')
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(
        screen.getByText('5秒後にログインページに移動します')
      ).toBeInTheDocument();
    });
  });
});
