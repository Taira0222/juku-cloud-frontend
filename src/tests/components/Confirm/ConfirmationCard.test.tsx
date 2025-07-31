// ConfirmationCard.test.tsx
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ConfirmationCard } from '@/components/Confirm/ConfirmationCard';

describe('ConfirmationCard component', () => {
  // モック関数の定義
  const mockOnManualRedirect = vi.fn();
  const mockOnHomeRedirect = vi.fn();
  // モックカウントダウン値
  const MOCK_COUNTDOWN: number = 10;
  const RERENDER_MOCK_COUNTDOWN: number = 1;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Success state', () => {
    test('renders success UI correctly', () => {
      render(
        <ConfirmationCard
          isSuccess={true}
          countdown={MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      expect(screen.getByText('アカウント確認完了')).toBeInTheDocument();
      expect(
        screen.getByText('アカウントが正常に確認されました')
      ).toBeInTheDocument();
      expect(
        screen.getByText(`${MOCK_COUNTDOWN}秒後にログインページに移動します`)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ログインページへ' })
      ).toBeInTheDocument();

      // 失敗時のホームボタンは表示されない
      expect(screen.queryByText('ホームに戻る')).not.toBeInTheDocument();
    });

    test('calls onManualRedirect when button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmationCard
          isSuccess={true}
          countdown={MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      const button = screen.getByRole('button', { name: 'ログインページへ' });
      await user.click(button);
      // 成功時にはmockOnManualRedirect のみが呼ばれる
      expect(mockOnManualRedirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Failure state', () => {
    test('renders failure UI correctly', () => {
      render(
        <ConfirmationCard
          isSuccess={false}
          countdown={MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      expect(screen.getByText('アカウント確認失敗')).toBeInTheDocument();
      expect(
        screen.getByText(/確認リンクが無効または期限切れ/)
      ).toBeInTheDocument();
      expect(
        screen.getByText('10秒後に会員登録ページに移動します')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '会員登録ページへ' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'ホームに戻る' })
      ).toBeInTheDocument();
    });

    test('calls callback functions when buttons are clicked', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmationCard
          isSuccess={false}
          countdown={MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      const signUpButton = screen.getByRole('button', {
        name: '会員登録ページへ',
      });
      const homeButton = screen.getByRole('button', { name: 'ホームに戻る' });

      // 失敗時にはmockOnHomeRedirect(会員登録ページ)とmockOnManualRedirect(ホーム)の両方が呼ばれる
      await user.click(signUpButton);
      expect(mockOnManualRedirect).toHaveBeenCalledTimes(1);

      await user.click(homeButton);
      expect(mockOnHomeRedirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Countdown display', () => {
    test('displays different countdown values correctly', () => {
      const { rerender } = render(
        <ConfirmationCard
          isSuccess={true}
          countdown={MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      expect(
        screen.getByText(`${MOCK_COUNTDOWN}秒後にログインページに移動します`)
      ).toBeInTheDocument();

      rerender(
        <ConfirmationCard
          isSuccess={true}
          countdown={RERENDER_MOCK_COUNTDOWN}
          onManualRedirect={mockOnManualRedirect}
          onHomeRedirect={mockOnHomeRedirect}
        />
      );

      expect(
        screen.getByText(
          `${RERENDER_MOCK_COUNTDOWN}秒後にログインページに移動します`
        )
      ).toBeInTheDocument();
    });
  });
});
