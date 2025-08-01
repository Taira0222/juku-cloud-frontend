import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/student_management', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated() ? null : <Outlet />;
};
