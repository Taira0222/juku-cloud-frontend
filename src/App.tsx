import './App.css';
import { Toaster } from './components/ui/feedback/Sonner/sonner';
import { Redirector } from './Router/Redirector';
import { Router } from './Router/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Redirector />
        <Toaster richColors position="top-right" />
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
