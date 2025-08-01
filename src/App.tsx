import './App.css';
import { Router } from './Router/Router';
import { useAuthStore } from './stores/authStore';

function App() {
  // 開発環境では、認証ストアの永続化をクリアする
  if (process.env.NODE_ENV === 'development') {
    useAuthStore.persist.clearStorage();
  }
  return (
    <>
      <Router />
    </>
  );
}

export default App;
