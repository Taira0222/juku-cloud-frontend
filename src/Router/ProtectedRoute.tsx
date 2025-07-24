import { useAuthStore } from '@/stores/authStore';
import { useWarningStore } from '@/stores/warningStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProtectedRoute = () => {
  const auth = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const setWarningMessage = useWarningStore((state) => state.setWarningMessage);

  useEffect(() => {
    // 認証情報がない場合はログインページへリダイレクト
    if (!auth) {
      setWarningMessage('認証情報がありません。ログインしてください。');
      navigate('/sign_in');
    }
  }, [auth, navigate, setWarningMessage]);
  // 認証情報がある場合は子コンポーネントを表示
  return auth ? <Outlet /> : null;
};
