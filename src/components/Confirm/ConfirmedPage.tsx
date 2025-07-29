import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmationCard } from './ConfirmationCard';

export const ConfirmedPage = () => {
  const [params] = useSearchParams();
  const success = params.get('account_confirmation_success') === 'true';

  const COUNTDOWN_SECONDS: number = 10;
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (success) {
            navigate('/sign_in', { replace: true });
          } else {
            navigate('/sign_up', { replace: true });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, success]);

  const handleManualRedirect = () => {
    if (success) {
      navigate('/sign_in', { replace: true });
    } else {
      navigate('/sign_up', { replace: true });
    }
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <ConfirmationCard
      isSuccess={success}
      countdown={countdown}
      onManualRedirect={handleManualRedirect}
      onHomeRedirect={handleHomeRedirect}
    />
  );
};
