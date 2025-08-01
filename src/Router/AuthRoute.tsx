import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const isUserAuthenticated = isAuthenticated();

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate('/students_management', { replace: true });
    }
  }, [isUserAuthenticated, navigate]);

  return isUserAuthenticated ? null : <Outlet />;
};
