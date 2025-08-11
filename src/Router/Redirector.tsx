import { useNavStore } from '@/stores/navStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Redirector = () => {
  const navigate = useNavigate();
  const replace = useNavStore((state) => state.replace);
  const nextPath = useNavStore((state) => state.nextPath);
  const clearNextPath = useNavStore((state) => state.clearNextPath);

  useEffect(() => {
    if (!nextPath) return;
    navigate(nextPath, { replace });
    // NextPath リセット
    clearNextPath();
  }, [nextPath, replace, navigate]);

  return null;
};
