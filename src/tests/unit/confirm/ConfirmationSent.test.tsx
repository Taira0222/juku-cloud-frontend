import { describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ConfirmationSent } from '@/pages/confirm/ConfirmationSentPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const SignUp = () => <div data-testid="sign-up">Sign Up Page</div>;
const Home = () => <div data-testid="home">Home Page</div>;

describe('ConfirmationSent component unit tests', () => {
  test('renders ConfirmationSent component', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/sign_up/confirmation_sent',
            state: { from: '/sign_up' },
          },
        ]}
      >
        <ConfirmationSent />
      </MemoryRouter>
    );
    // 確認メール送信のタイトルが表示されていることを確認
    const title = screen.getByText('確認メールを送信しました');
    expect(title).toBeInTheDocument();

    // アカウント作成完了の説明が表示されていることを確認
    const description = screen.getByText(
      'アカウント作成を完了するため、メールを確認してください'
    );
    expect(description).toBeInTheDocument();

    // アラートのタイトルと説明が表示されていることを確認
    const alertTitle = screen.getByText('メールを確認してください');
    expect(alertTitle).toBeInTheDocument();
    const alertDescription = screen.getByText(
      /メールボックスを確認し、リンクをクリックしてアカウントを有効化してください。.*メールが見つからない場合は、迷惑メールフォルダもご確認ください。/
    );
    expect(alertDescription).toBeInTheDocument();

    // ホーム画面への自動遷移の説明が表示されていることを確認
    const autoRedirect = screen.getByText(/秒後に自動でホームページに戻ります/);
    expect(autoRedirect).toBeInTheDocument();

    // ホーム画面へのリンクが表示されていることを確認
    const homeButton = screen.getByRole('button', { name: 'ホームに戻る' });
    expect(homeButton).toBeInTheDocument();
  });
});

describe('ConfirmationSent component navigation tests', () => {
  const renderWithRouter = (state: string | null) => {
    return render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/sign_up/confirmation_sent',
            state: { from: state },
          },
        ]}
      >
        <Routes>
          <Route
            path="/sign_up/confirmation_sent"
            element={<ConfirmationSent />}
          />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  };
  test('move to home page when button is clicked', async () => {
    renderWithRouter('/sign_up');
    const user = userEvent.setup();
    const homeButton = screen.getByRole('button', { name: 'ホームに戻る' });
    await user.click(homeButton);
    expect(await screen.findByTestId('home')).toBeInTheDocument();
  });

  test('redirects to home page after 10 seconds', () => {
    vi.useFakeTimers();
    renderWithRouter('/sign_up');
    // 初期状態では確認メール送信画面が表示されている
    expect(screen.getByText('確認メールを送信しました')).toBeInTheDocument();
    expect(
      screen.getByText('10秒後に自動でホームページに戻ります')
    ).toBeInTheDocument();

    // ConfirmationSentページが表示されていることを確認
    expect(screen.queryByTestId('home')).not.toBeInTheDocument();

    // act() は内部でuseEffectやDOMの更新をしてくれる
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // ホームページに遷移していることを確認
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(
      screen.queryByText('確認メールを送信しました')
    ).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  test('redirects to sign up page when state is null', async () => {
    renderWithRouter(null);
    await waitFor(() => {
      expect(screen.getByTestId('sign-up')).toBeInTheDocument();
    });
  });
});
