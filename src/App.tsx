import './App.css';
import { Toaster } from './components/ui/feedback/Sonner/sonner';
import { Redirector } from './Router/Redirector';
import { Router } from './Router/Router';

function App() {
  return (
    <>
      <Redirector />
      <Toaster position="top-right" />
      <Router />
    </>
  );
}

export default App;
