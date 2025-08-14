import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmationCard } from '@/features/confirm/components/ConfirmationCard/ConfirmationCard';

export const ConfirmedPage = () => {
  const [params] = useSearchParams();
  const success = params.get('account_confirmation_success') === 'true';

  const COUNTDOWN_SECONDS: number = 10;
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate(success ? '/sign_in' : '/sign_up', { replace: true });
    }
  }, [countdown, navigate, success]);

  // 手動遷移ハンドラー
  const handleManualNavigation = () => {
    navigate(success ? '/sign_in' : '/sign_up', { replace: true });
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <ConfirmationCard
      isSuccess={success}
      countdown={countdown}
      onManualRedirect={handleManualNavigation}
      onHomeRedirect={handleNavigateToHome}
    />
  );
};
